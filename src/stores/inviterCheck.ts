import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInviterCheckStore = defineStore('inviterCheck', () => {
  // 存储已检查过的钱包地址集合
  const checkedAddresses = ref<Set<string>>(new Set())

  // 检查指定地址是否已经检查过
  function hasChecked(address: string): boolean {
    return checkedAddresses.value.has(address.toLowerCase())
  }

  // 标记指定地址已检查
  function markAsChecked(address: string): void {
    checkedAddresses.value.add(address.toLowerCase())
  }

  // 重置所有检查记录
  function resetAll(): void {
    checkedAddresses.value.clear()
  }

  return {
    hasChecked,
    markAsChecked,
    resetAll,
  }
})
