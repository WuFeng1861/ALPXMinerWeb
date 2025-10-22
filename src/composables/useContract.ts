import { ref } from 'vue'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESSES, ERC20_ABI, TOKEN_INFO, type TokenSymbol } from '../config/contracts'

export function useContract() {
  const isProcessing = ref(false)

  // 获取代币合约实例
  function getTokenContract(
    tokenSymbol: TokenSymbol,
    signerOrProvider: ethers.Signer | ethers.Provider
  ) {
    const tokenInfo = TOKEN_INFO[tokenSymbol]
    return new ethers.Contract(tokenInfo.address, ERC20_ABI, signerOrProvider)
  }

  // 检查授权额度
  async function checkAllowance(
    tokenSymbol: TokenSymbol,
    owner: string,
    spender: string,
    provider: ethers.Provider
  ): Promise<bigint> {
    try {
      const contract = getTokenContract(tokenSymbol, provider)
      const allowance = await contract.allowance(owner, spender)
      return allowance
    } catch (error) {
      console.error(`Failed to check allowance for ${tokenSymbol}:`, error)
      return 0n
    }
  }

  // 授权代币
  async function approveToken(
    tokenSymbol: TokenSymbol,
    spender: string,
    amount: bigint,
    signer: ethers.Signer
  ): Promise<boolean> {
    isProcessing.value = true

    try {
      const contract = getTokenContract(tokenSymbol, signer)
      const tx = await contract.approve(spender, amount)

      console.log(`Approving ${tokenSymbol}... Tx hash:`, tx.hash)

      const receipt = await tx.wait()

      console.log(`${tokenSymbol} approved! Block:`, receipt.blockNumber)

      return true
    } catch (error) {
      console.error(`Failed to approve ${tokenSymbol}:`, error)
      return false
    } finally {
      isProcessing.value = false
    }
  }

  // 获取代币余额
  async function getTokenBalance(
    tokenSymbol: TokenSymbol,
    address: string,
    provider: ethers.Provider
  ): Promise<bigint> {
    try {
      const contract = getTokenContract(tokenSymbol, provider)
      const balance = await contract.balanceOf(address)
      return balance
    } catch (error) {
      console.error(`Failed to get balance for ${tokenSymbol}:`, error)
      return 0n
    }
  }

  // 格式化数量（将用户输入转换为 wei）
  function parseAmount(amount: string, decimals: number = 18): bigint {
    try {
      return ethers.parseUnits(amount, decimals)
    } catch (error) {
      console.error('Failed to parse amount:', error)
      return 0n
    }
  }

  // 格式化余额（从 wei 转换为可读格式）
  function formatAmount(amount: bigint, decimals: number = 18): string {
    try {
      return ethers.formatUnits(amount, decimals)
    } catch (error) {
      console.error('Failed to format amount:', error)
      return '0'
    }
  }

  // 检查并授权代币（如果需要）
  async function ensureAllowance(
    tokenSymbol: TokenSymbol,
    owner: string,
    spender: string,
    requiredAmount: bigint,
    signer: ethers.Signer,
    provider: ethers.Provider
  ): Promise<boolean> {
    try {
      const currentAllowance = await checkAllowance(tokenSymbol, owner, spender, provider)

      if (currentAllowance >= requiredAmount) {
        console.log(`${tokenSymbol} already has sufficient allowance`)
        return true
      }

      console.log(`${tokenSymbol} needs approval. Current: ${currentAllowance}, Required: ${requiredAmount}`)

      return await approveToken(tokenSymbol, spender, requiredAmount, signer)
    } catch (error) {
      console.error(`Failed to ensure allowance for ${tokenSymbol}:`, error)
      return false
    }
  }

  return {
    isProcessing,
    getTokenContract,
    checkAllowance,
    approveToken,
    getTokenBalance,
    parseAmount,
    formatAmount,
    ensureAllowance,
    CONTRACT_ADDRESSES,
    TOKEN_INFO,
  }
}
