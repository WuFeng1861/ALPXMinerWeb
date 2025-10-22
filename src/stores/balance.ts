import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ethers } from 'ethers'
import { eventBus, EventTypes } from '../utils/eventBus'
import { CONTRACT_ADDRESSES, ERC20_ABI } from '../config/contracts'

export interface Balances {
  usdt: number
  alpx: number
  alps: number
}

export const useBalanceStore = defineStore('balance', () => {
  const balances = ref<Balances>({
    usdt: 0,
    alpx: 0,
    alps: 0,
  })

  const isLoading = ref(false)

  // 格式化余额（从 wei 转换为数字）
  function formatBalance(balance: bigint, decimals: number = 18): number {
    try {
      const formatted = ethers.formatUnits(balance, decimals)
      return parseFloat(formatted)
    } catch (error) {
      console.error('Failed to format balance:', error)
      return 0
    }
  }

  // 获取代币余额
  async function fetchBalances(address: string, provider: any) {
    if (!address || !provider) {
      console.log('[Balance Store] fetchBalances skipped - missing address or provider')
      return
    }

    console.log('[Balance Store] Fetching balances for', address)
    isLoading.value = true

    try {
      // 创建合约实例
      const usdtContract = new ethers.Contract(
        CONTRACT_ADDRESSES.USDT,
        ERC20_ABI,
        provider
      )
      const alpxContract = new ethers.Contract(
        CONTRACT_ADDRESSES.ALPX,
        ERC20_ABI,
        provider
      )
      const alpsContract = new ethers.Contract(
        CONTRACT_ADDRESSES.ALPS,
        ERC20_ABI,
        provider
      )

      // 并行获取所有余额
      const [usdtBalance, alpxBalance, alpsBalance] = await Promise.all([
        usdtContract.balanceOf(address),
        alpxContract.balanceOf(address),
        alpsContract.balanceOf(address),
      ])

      // 格式化余额
      balances.value = {
        usdt: formatBalance(usdtBalance),
        alpx: formatBalance(alpxBalance),
        alps: formatBalance(alpsBalance),
      }

      console.log('[Balance Store] Balances fetched successfully:', balances.value)

      // 发布余额更新事件
      eventBus.emit(EventTypes.BALANCE_UPDATE, balances.value)
    } catch (error) {
      console.error('[Balance Store] Failed to fetch balances:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 清空余额
  function clearBalances() {
    balances.value = {
      usdt: 0,
      alpx: 0,
      alps: 0,
    }
  }

  // 初始化事件监听
  function initEventListeners() {
    // 当钱包连接时获取余额
    eventBus.on(EventTypes.WALLET_CONNECTED, (data) => {
      console.log('[Balance Store] WALLET_CONNECTED event received', data.address)
      fetchBalances(data.address, data.provider)
    })

    // 当钱包断开时清空余额
    eventBus.on(EventTypes.WALLET_DISCONNECTED, () => {
      console.log('[Balance Store] WALLET_DISCONNECTED event received')
      clearBalances()
    })

    console.log('[Balance Store] Event listeners initialized')
  }

  return {
    balances,
    isLoading,
    fetchBalances,
    clearBalances,
    initEventListeners,
  }
})
