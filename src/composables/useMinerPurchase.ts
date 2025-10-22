import { ref } from 'vue'
import { ethers } from 'ethers'
import { useMiner } from './useMiner'
import { useContract } from './useContract'
import { CONTRACT_ADDRESSES } from '../config/contracts'
import { MinerMode } from '../types'
import { t } from '../i18n'

export type PurchaseStep = 'approve_usdt' | 'approve_alps' | 'buying'

export interface PurchaseProgress {
  step: PurchaseStep
  status: 'processing' | 'done'
}

export function useMinerPurchase() {
  const { buyMiner } = useMiner()
  const { ensureAllowance, parseAmount } = useContract()

  const isPurchasing = ref(false)

  const MINER_PRICES = {
    [MinerMode.USDT_ONLY]: {
      usdt: 200,
      alps: 0,
    },
    [MinerMode.USDT_ALPS_MIX]: {
      usdt: 100,
      alps: 1000000,
    },
    [MinerMode.USDT_ALPS_MIX2]: {
      usdt: 50,
      alps: 1500000,
    },
  }

  async function purchaseMiner(
    mode: MinerMode,
    userAddress: string,
    signer: ethers.Signer,
    provider: ethers.Provider,
    onProgress?: (progress: PurchaseProgress) => void
  ): Promise<boolean> {
    isPurchasing.value = true

    try {
      const price = MINER_PRICES[mode]
      const minerAddress = CONTRACT_ADDRESSES.ALPXMiner

      if (price.usdt > 0) {
        onProgress?.({ step: 'approve_usdt', status: 'processing' })

        const usdtAmount = parseAmount(price.usdt.toString(), 18)
        const usdtApproved = await ensureAllowance(
          'USDT',
          userAddress,
          minerAddress,
          usdtAmount,
          signer,
          provider
        )

        if (!usdtApproved) {
          throw new Error(t('usdtAuthFailed'))
        }

        onProgress?.({ step: 'approve_usdt', status: 'done' })
      }

      if (price.alps > 0) {
        onProgress?.({ step: 'approve_alps', status: 'processing' })

        const alpsAmount = parseAmount(price.alps.toString(), 18)
        const alpsApproved = await ensureAllowance(
          'ALPS',
          userAddress,
          minerAddress,
          alpsAmount,
          signer,
          provider
        )

        if (!alpsApproved) {
          throw new Error(t('alpsAuthFailed'))
        }

        onProgress?.({ step: 'approve_alps', status: 'done' })
      }

      onProgress?.({ step: 'buying', status: 'processing' })

      const success = await buyMiner(mode, signer)

      if (success) {
        onProgress?.({ step: 'buying', status: 'done' })
        return true
      } else {
        throw new Error(t('buyMinerFailed'))
      }
    } catch (error) {
      console.error('Purchase failed:', error)
      throw error
    } finally {
      isPurchasing.value = false
    }
  }

  return {
    isPurchasing,
    purchaseMiner,
    MINER_PRICES,
  }
}
