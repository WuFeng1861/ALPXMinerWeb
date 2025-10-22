import { ref } from 'vue'
import { ethers } from 'ethers'
import { useMinerStore } from '../stores/miner'

// 导出类型，保持兼容性
export type { UserInfo, FullUserInfo, DirectsResult } from '../stores/miner'

export function useMiner() {
  const isProcessing = ref(false)
  const minerStore = useMinerStore()

  // 获取矿机合约实例
  function getMinerContract(signerOrProvider: ethers.Signer | ethers.Provider) {
    return minerStore.getMinerContract(signerOrProvider)
  }

  // 绑定上级
  async function bindInviter(
    inviterAddress: string,
    signer: ethers.Signer
  ): Promise<boolean> {
    isProcessing.value = true

    try {
      const contract = getMinerContract(signer)
      const tx = await contract.bindInviter(inviterAddress)

      console.log('Binding inviter... Tx hash:', tx.hash)

      const receipt = await tx.wait()

      console.log('Inviter bound! Block:', receipt.blockNumber)

      // 绑定成功后刷新用户信息
      const address = await signer.getAddress()
      await minerStore.fetchUserInfo(address, signer)

      return true
    } catch (error) {
      console.error('Failed to bind inviter:', error)
      return false
    } finally {
      isProcessing.value = false
    }
  }

  // 购买矿机
  async function buyMiner(
    mode: number,
    signer: ethers.Signer
  ): Promise<boolean> {
    isProcessing.value = true

    try {
      const contract = getMinerContract(signer)
      const tx = await contract.buy(mode)

      console.log(`Buying miner mode ${mode}... Tx hash:`, tx.hash)

      const receipt = await tx.wait()

      console.log('Miner purchased! Block:', receipt.blockNumber)

      // 购买成功后刷新用户信息
      const address = await signer.getAddress()
      await minerStore.fetchUserInfo(address, signer)

      return true
    } catch (error) {
      console.error('Failed to buy miner:', error)
      return false
    } finally {
      isProcessing.value = false
    }
  }

  // 领取所有矿机收益
  async function claimAllSelf(signer: ethers.Signer): Promise<boolean> {
    isProcessing.value = true

    try {
      const contract = getMinerContract(signer)
      const tx = await contract.claimAllSelf()

      console.log('Claiming all self rewards... Tx hash:', tx.hash)

      const receipt = await tx.wait()

      console.log('Self rewards claimed! Block:', receipt.blockNumber)

      // 领取成功后刷新用户信息
      const address = await signer.getAddress()
      await minerStore.fetchUserInfo(address, signer)

      return true
    } catch (error) {
      console.error('Failed to claim self rewards:', error)
      return false
    } finally {
      isProcessing.value = false
    }
  }

  // 领取所有推荐奖励
  async function claimTeam(signer: ethers.Signer): Promise<boolean> {
    isProcessing.value = true

    try {
      const contract = getMinerContract(signer)
      const tx = await contract.claimTeam()

      console.log('Claiming team rewards... Tx hash:', tx.hash)

      const receipt = await tx.wait()

      console.log('Team rewards claimed! Block:', receipt.blockNumber)

      // 领取成功后刷新用户信息
      const address = await signer.getAddress()
      await minerStore.fetchUserInfo(address, signer)

      return true
    } catch (error) {
      console.error('Failed to claim team rewards:', error)
      return false
    } finally {
      isProcessing.value = false
    }
  }

  return {
    isProcessing,
    // 从 store 获取状态
    userInfo: minerStore.userInfo,
    hasInviter: minerStore.hasInviter,
    hasMiner: minerStore.hasMiner,
    directsList: minerStore.directsList,
    directsTotal: minerStore.directsTotal,
    isLoading: minerStore.isLoading,
    pendingSelf: minerStore.pendingSelf,
    pendingTeam: minerStore.pendingTeam,
    // 从 store 获取查询方法
    fetchUserInfo: minerStore.fetchUserInfo,
    fetchDirectsLength: minerStore.fetchDirectsLength,
    fetchDirects: minerStore.fetchDirects,
    fetchPendingTeamClaimable: minerStore.fetchPendingTeamClaimable,
    fetchPendingSelfAll: minerStore.fetchPendingSelfAll,
    refreshAllData: minerStore.refreshAllData,
    // 操作方法
    getMinerContract,
    bindInviter,
    buyMiner,
    claimAllSelf,
    claimTeam,
  }
}
