<template>
  <div class="container mx-auto px-4 py-6 pb-24">

    <BindReferrerModal
      :show="showBindModal"
      @close="showBindModal = false"
      @success="handleBindSuccess"
    />

    <MinerCarousel
      :miners="miners"
      @buy="openBuyModal"
      class="mb-8"
    />

    <div class="mb-6">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm text-gray-400">{{ t('progress') }}</span>
        <span class="text-sm font-medium text-primary">{{ soldCount }} / 1500</span>
      </div>
      <div class="w-full bg-[#2d2d2d] h-3 rounded-full overflow-hidden border border-[#00ffff]/30">
        <div
          class="h-full bg-gradient-tech transition-all duration-500 shadow-glow-cyan"
          :style="{ width: `${(soldCount / 1500) * 100}%` }"
        ></div>
      </div>
    </div>

    <div class="card-tech mb-6">
      <h3 class="text-xl font-bold mb-4 text-primary">{{ t('balance') }}</h3>
      <div class="space-y-3">
        <div class="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg border border-[#00a3ff]/30">
          <div class="flex items-center gap-3">
            <img src="https://wufeng98.cn/imgServerApi/images/8b4ac19c-a29c-490f-9a91-6ffe467fed7e.png" alt="USDT" class="w-8 h-8 rounded-full" />
            <span class="font-medium">USDT</span>
          </div>
          <span class="font-bold text-primary">
            <FormattedNumber :value="balances.usdt" :use-commas="true" />
          </span>
        </div>
        <div class="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg border border-[#00a3ff]/30">
          <div class="flex items-center gap-3">
            <img src="https://wufeng98.cn/imgServerApi/images/d33954db-5c32-4554-9cbd-28a2fd144110.png" alt="ALPX" class="w-8 h-8 rounded-full" />
            <span class="font-medium">ALPX</span>
          </div>
          <span class="font-bold text-primary">
            <FormattedNumber :value="balances.alpx" :use-commas="true" />
          </span>
        </div>
        <div class="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg border border-[#00a3ff]/30">
          <div class="flex items-center gap-3">
            <img src="https://wufeng98.cn/imgServerApi/images/4d35f283-bf43-459b-be74-a1c1810f19a6.png" alt="ALPS" class="w-8 h-8 rounded-full" />
            <span class="font-medium">ALPS</span>
          </div>
          <span class="font-bold text-primary">
            <FormattedNumber :value="balances.alps" :use-commas="true" />
          </span>
        </div>
      </div>
    </div>

    <details class="card-tech">
      <summary class="text-lg font-bold cursor-pointer text-primary hover:text-primary-dark transition-colors">
        {{ t('projectInfo') }}
      </summary>
      <div class="mt-4 space-y-4 text-sm text-gray-300 leading-relaxed">
        <div class="border-l-4 border-[#00ffff] pl-4">
          <div class="font-bold text-primary mb-2">{{ t('stage1') }}</div>
          <div>50 USDT + 1500K ALPS</div>
          <div>100 USDT + 1000K ALPS</div>
          <div>200 USDT</div>
          <div class="text-primary-dark mt-1">{{ t('stage1Output') }}</div>
        </div>
        <div class="border-l-4 border-[#00a3ff] pl-4">
          <div class="font-bold text-primary-dark mb-2">{{ t('stage2') }}</div>
          <div>100 USDT + 1000K枚 ALPS</div>
          <div>{{ t('or') }} 200 USDT</div>
          <div class="text-primary mt-1">{{ t('stage2Output') }}</div>
        </div>
        <div class="border-l-4 border-[#00ffff] pl-4">
          <div class="font-bold text-primary mb-2">{{ t('stage3') }}</div>
          <div>150 USDT + 500K枚 ALPS</div>
          <div class="text-primary-dark mt-1">{{ t('stage3Output') }}</div>
        </div>
        <div class="border-l-4 border-[#00a3ff] pl-4">
          <div class="font-bold text-primary-dark mb-2">{{ t('stage4') }}</div>
          <div>200 USDT</div>
          <div class="text-primary mt-1">{{ t('stage4Output') }}</div>
        </div>
      </div>
    </details>

    <AlphaIntro class="mt-6" />

    <div
      v-if="showBuyModal"
      class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="closeBuyModal"
    >
      <div class="card-tech max-w-md w-full">
        <h2 class="text-2xl font-bold text-center mb-6 bg-gradient-tech bg-clip-text text-transparent">
          {{ t('buyProcess') }}
        </h2>

        <div class="space-y-4">
          <div
            v-for="(step, index) in buySteps"
            :key="index"
            class="flex items-center gap-4 p-4 rounded-lg transition-all"
            :class="step.status === 'processing' ? 'bg-gradient-tech/20 border-2 border-[#00ffff]' : 'bg-[#2a2a2a] border border-[#00a3ff]/30'"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all"
              :class="step.status === 'done' ? 'bg-[#00ffff] text-[#1a1a1a]' : step.status === 'processing' ? 'bg-gradient-tech text-white animate-pulse' : 'bg-[#2d2d2d] text-gray-400'"
            >
              {{ step.status === 'done' ? '✓' : index + 1 }}
            </div>
            <div class="flex-1">
              <div class="font-medium">{{ step.label }}</div>
              <div v-if="step.status === 'processing'" class="text-sm text-primary">
                {{ t('processing') }}
              </div>
            </div>
          </div>

          <div v-if="purchaseError" class="text-red-400 text-sm text-center p-3 bg-red-900/20 rounded-lg border border-red-500/30">
            {{ purchaseError }}
          </div>

          <button
            v-if="allStepsDone"
            @click="closeBuyModal"
            class="btn-tech w-full"
          >
            {{ t('complete') }}
          </button>

          <button
            v-else-if="purchaseError && !isPurchasing"
            @click="closeBuyModal"
            class="w-full bg-secondary border-2 border-gray-600 text-white font-semibold py-3 px-6 rounded-lg hover:border-gray-500 transition-all duration-300"
          >
            {{ t('cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { t } from '../i18n'
import type { MinerCard } from '../types'
import { MinerMode } from '../types'
import MinerCarousel from '../components/MinerCarousel.vue'
import FormattedNumber from '../components/FormattedNumber.vue'
import BindReferrerModal from '../components/BindReferrerModal.vue'
import AlphaIntro from '../components/AlphaIntro.vue'
import { useMiner } from '../composables/useMiner'
import { useWallet } from '../composables/useWallet'
import { useMinerPurchase } from '../composables/useMinerPurchase'
import { useInviterCheckStore } from '../stores/inviterCheck'
import { useBalanceStore } from '../stores/balance'
import { useToast } from '../composables/useToast'
import { eventBus, EventTypes } from '../utils/eventBus'
import {useMinerStore} from '../stores/miner.ts';

// 矿机方案配置
const miners = ref<MinerCard[]>([
  { id: MinerMode.USDT_ONLY, usdt: 200, alps: 0, production: '52000 ALPX' },
  { id: MinerMode.USDT_ALPS_MIX, usdt: 100, alps: 1000000, production: '52000 ALPX' },
  { id: MinerMode.USDT_ALPS_MIX2, usdt: 50, alps: 1500000, production: '52000 ALPX' },
])

// 已售矿机数量（从链上获取）
const soldCount = ref(0)
const { address, getProvider, getSigner, isConnected } = useWallet()
const { getMinerContract } = useMiner()
const { purchaseMiner, isPurchasing } = useMinerPurchase()
const inviterCheckStore = useInviterCheckStore()
const minerStore = useMinerStore()

// 绑定推荐人模态框
const showBindModal = ref(false)

// 获取已售数量
async function loadSoldCount() {
  const provider = getProvider()
  if (provider) {
    try {
      const contract = getMinerContract(provider)
      const sold = await contract.soldSupply()
      soldCount.value = Number(sold)
    } catch (error) {
      console.error('Failed to fetch sold count:', error)
    }
  }
}

// 检查用户是否有上级
async function checkUserInviter() {
  const signer = await getSigner()
  if (!address.value || !signer) return

  // 如果该地址已经检查过，不再重复检查
  if (inviterCheckStore.hasChecked(address.value)) return

  try {
    await minerStore.fetchUserInfo(address.value, signer)

    // 标记该地址已检查
    inviterCheckStore.markAsChecked(address.value)

    // 如果用户没有上级，显示绑定模态框
    if (!minerStore.hasInviter) {
      showBindModal.value = true
    }
  } catch (error) {
    console.error('Failed to check user inviter:', error)
  }
}

// 监听钱包连接状态
watch(isConnected, async (connected) => {
  if (connected) {
    await loadSoldCount()
    await checkUserInviter()
  }
})

onMounted(async () => {
  await loadSoldCount()

  if (isConnected.value) {
    await checkUserInviter()
    // 如果已连接但余额为空，手动加载余额
    if (address.value && balances.value.usdt === 0 && balances.value.alpx === 0 && balances.value.alps === 0) {
      const provider = getProvider()
      if (provider) {
        await balanceStore.fetchBalances(address.value, provider)
      }
    }
  }

  // 订阅钱包连接事件
  eventBus.on(EventTypes.WALLET_CONNECTED, async () => {
    await checkUserInviter()
  })

  // 订阅显示绑定弹窗事件
  eventBus.on(EventTypes.SHOW_BIND_REFERRER_MODAL, () => {
    showBindModal.value = true
  })
})

// 绑定成功后的回调
async function handleBindSuccess() {
  showBindModal.value = false
  // 重新获取用户信息
  const signer = await getSigner()
  if (address.value && signer) {
    await minerStore.fetchUserInfo(address.value, signer)
  }
}

// 使用 useBalance 订阅余额更新
const balanceStore = useBalanceStore()
const { balances } = storeToRefs(balanceStore)

const showBuyModal = ref(false)
const selectedMiner = ref<MinerCard | null>(null)
const buySteps = ref<Array<{ label: string; status: string }>>([])
const purchaseError = ref<string>('')

const allStepsDone = computed(() => {
  return buySteps.value.length > 0 && buySteps.value.every(step => step.status === 'done')
})

function openBuyModal(miner: MinerCard) {
  const toast = useToast()
  if (!address.value || !isConnected.value) {
    toast.warning(t('pleaseConnectWallet'))
    return
  }

  selectedMiner.value = miner
  purchaseError.value = ''

  buySteps.value = [
    { label: t('approveUsdt'), status: 'pending' },
    ...(miner.alps > 0 ? [{ label: t('approveAlps'), status: 'pending' }] : []),
    { label: t('purchasing'), status: 'pending' },
  ]

  showBuyModal.value = true
  handleBuyMiner()
}

function closeBuyModal() {
  if (isPurchasing.value) return
  showBuyModal.value = false
  selectedMiner.value = null
  purchaseError.value = ''
}

async function handleBuyMiner() {
  if (!selectedMiner.value || !address.value) return

  const signer = await getSigner()
  const provider = getProvider()

  if (!signer || !provider) {
    purchaseError.value = t('walletNotConnected')
    return
  }

  try {
    const success = await purchaseMiner(
      selectedMiner.value.id,
      address.value,
      signer,
      provider,
      (progress) => {
        let stepIndex = -1

        if (progress.step === 'approve_usdt') {
          stepIndex = 0
        } else if (progress.step === 'approve_alps') {
          stepIndex = buySteps.value.findIndex(s => s.label === t('approveAlps'))
        } else if (progress.step === 'buying') {
          stepIndex = buySteps.value.length - 1
        }

        if (stepIndex >= 0 && stepIndex < buySteps.value.length) {
          buySteps.value[stepIndex].status = progress.status
        }
      }
    )

    if (success) {
      await loadSoldCount()

      if (address.value && signer) {
        await minerStore.fetchUserInfo(address.value, signer)
      }
    } else {
      purchaseError.value = t('purchaseFailed')
    }
  } catch (error: any) {
    console.error('Purchase error:', error)
    purchaseError.value = error.message || t('purchaseFailed')
  }
}
</script>
