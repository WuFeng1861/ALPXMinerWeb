import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import {ethers} from 'ethers';
import {eventBus, EventTypes} from '../utils/eventBus';
import {CONTRACT_ADDRESSES, ALPXMiner_ABI} from '../config/contracts';

// 用户信息接口
export interface UserInfo {
  inviter: string;
  machineCnt: number;
  teamDaily: bigint;
  lastClaimTime: bigint;
  pendingTeam: bigint;
  offset: bigint;
  claimedTeam: bigint;
  teamEffectiveCnt: number;
}

// 完整用户信息（包含额外计算字段）
export interface FullUserInfo {
  user: UserInfo;
  totalSpeed: bigint;
  totalClaimedSelf: bigint;
}

// 直推列表结果
export interface DirectsResult {
  list: string[];
  hasNext: boolean;
}

export const useMinerStore = defineStore('miner', () => {
  // 状态
  const userInfo = ref<FullUserInfo | null>(null);
  const directsList = ref<string[]>([]);
  const directsTotal = ref(0);
  const isLoading = ref(false);
  
  // 待领取收益
  const pendingSelf = ref<bigint>(BigInt(0));
  const pendingTeam = ref<bigint>(BigInt(0));
  
  // 自动刷新定时器
  let refreshTimer: ReturnType<typeof setInterval> | null = null;
  let currentAddress: string | null = null;
  let currentSigner: ethers.Signer | null = null;
  
  // 计算属性：是否已绑定上级
  const hasInviter = computed(() => {
    if (!userInfo.value) return false;
    return userInfo.value.user.inviter !== ethers.ZeroAddress;
  });
  
  // 计算属性：是否已购买矿机
  const hasMiner = computed(() => {
    if (!userInfo.value) return false;
    return userInfo.value.user.machineCnt > 0;
  });
  
  // 获取矿机合约实例
  function getMinerContract(signerOrProvider: ethers.Signer | ethers.Provider) {
    return new ethers.Contract(
      CONTRACT_ADDRESSES.ALPXMiner,
      ALPXMiner_ABI,
      signerOrProvider
    );
  }
  
  // 获取用户信息
  async function fetchUserInfo(
    address: string,
    signer: ethers.Signer
  ): Promise<FullUserInfo | null> {
    try {
      isLoading.value = true;
      const contract = getMinerContract(signer);
      const result = await contract.userInfo(address);
      
      const info: FullUserInfo = {
        user: {
          inviter: result.u.inviter,
          machineCnt: Number(result.u.machineCnt),
          teamDaily: result.u.teamDaily,
          lastClaimTime: result.u.lastClaimTime,
          pendingTeam: result.u.pendingTeam,
          offset: result.u.offset,
          claimedTeam: result.u.claimedTeam,
          teamEffectiveCnt: Number(result.u.teamEffectiveCnt),
        },
        totalSpeed: result.totalSpeed,
        totalClaimedSelf: result.totalClaimedSelf,
      };
      
      userInfo.value = info;
      console.log(userInfo.value, 'userInfo', userInfo.value.user.inviter, userInfo.value.user.inviter !== ethers.ZeroAddress, hasInviter.value);
      return info;
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  
  // 获取直推数量
  async function fetchDirectsLength(
    address: string,
    signer: ethers.Signer
  ): Promise<number> {
    try {
      const contract = getMinerContract(signer);
      const length = await contract.directsLength(address);
      directsTotal.value = Number(length);
      return Number(length);
    } catch (error) {
      console.error('Failed to fetch directs length:', error);
      return 0;
    }
  }
  
  // 获取直推列表
  async function fetchDirects(
    address: string,
    signer: ethers.Signer,
    offset: number = 0,
    limit: number = 20
  ): Promise<DirectsResult> {
    try {
      isLoading.value = true;
      const contract = getMinerContract(signer);
      const result = await contract.directs(address, offset, limit);
      
      const list = result.list.filter((addr: string) => addr !== ethers.ZeroAddress);
      const hasNext = result.hasNext;
      
      // 如果是第一页，替换列表；否则追加
      if (offset === 0) {
        directsList.value = list;
      } else {
        directsList.value = [...directsList.value, ...list];
      }
      
      return {list, hasNext};
    } catch (error) {
      console.error('Failed to fetch directs:', error);
      return {list: [], hasNext: false};
    } finally {
      isLoading.value = false;
    }
  }
  
  // 获取团队待领取奖励
  async function fetchPendingTeamClaimable(
    address: string,
    signer: ethers.Signer
  ): Promise<bigint> {
    try {
      const contract = getMinerContract(signer);
      const pending = await contract.pendingTeamClaimable(address);
      pendingTeam.value = pending;
      return pending;
    } catch (error) {
      console.error('Failed to fetch pending team claimable:', error);
      return BigInt(0);
    }
  }
  
  // 获取个人待领取总收益
  async function fetchPendingSelfAll(
    address: string,
    signer: ethers.Signer
  ): Promise<bigint> {
    try {
      const contract = getMinerContract(signer);
      const pending = await contract.pendingSelfAll(address);
      pendingSelf.value = pending;
      return pending;
    } catch (error) {
      console.error('Failed to fetch pending self all:', error);
      return BigInt(0);
    }
  }
  
  // 刷新所有数据（用户信息 + pending 数据）
  async function refreshAllData() {
    if (!currentAddress || !currentSigner) return;
    
    console.log('[Miner Store] Refreshing all data...');
    
    try {
      // 并行获取所有数据
      await Promise.all([
        fetchUserInfo(currentAddress, currentSigner),
        fetchPendingSelfAll(currentAddress, currentSigner),
        fetchPendingTeamClaimable(currentAddress, currentSigner),
      ]);
    } catch (error) {
      console.error('[Miner Store] Failed to refresh data:', error);
    }
  }
  
  // 启动自动刷新（每分钟刷新一次）
  function startAutoRefresh(address: string, signer: ethers.Signer) {
    // 停止旧的定时器
    stopAutoRefresh();
    
    currentAddress = address;
    currentSigner = signer;
    
    console.log('[Miner Store] Starting auto refresh for', address);
    
    // 立即刷新一次
    refreshAllData();
    
    // 每60秒刷新一次
    refreshTimer = setInterval(() => {
      refreshAllData();
    }, 60000);
  }
  
  // 停止自动刷新
  function stopAutoRefresh() {
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
    currentAddress = null;
    currentSigner = null;
    console.log('[Miner Store] Auto refresh stopped');
  }
  
  // 清空数据（钱包断开时调用）
  function clearData() {
    stopAutoRefresh();
    userInfo.value = null;
    directsList.value = [];
    directsTotal.value = 0;
    pendingSelf.value = BigInt(0);
    pendingTeam.value = BigInt(0);
  }
  
  // 初始化事件监听
  function initEventListeners() {
    // 当钱包连接时启动自动刷新
    eventBus.on(EventTypes.WALLET_CONNECTED, (data) => {
      console.log('[Miner Store] WALLET_CONNECTED event received');
      startAutoRefresh(data.address, data.signer);
    });
    
    // 当钱包断开时清空数据并停止刷新
    eventBus.on(EventTypes.WALLET_DISCONNECTED, () => {
      console.log('[Miner Store] WALLET_DISCONNECTED event received');
      clearData();
    });
    
    console.log('[Miner Store] Event listeners initialized');
  }
  
  return {
    // 状态
    userInfo,
    directsList,
    directsTotal,
    isLoading,
    pendingSelf,
    pendingTeam,
    
    // 计算属性
    hasInviter,
    hasMiner,
    
    // 方法
    getMinerContract,
    fetchUserInfo,
    fetchDirectsLength,
    fetchDirects,
    fetchPendingTeamClaimable,
    fetchPendingSelfAll,
    refreshAllData,
    startAutoRefresh,
    stopAutoRefresh,
    clearData,
    initEventListeners,
  };
});
