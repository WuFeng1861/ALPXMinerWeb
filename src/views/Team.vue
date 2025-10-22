<template>
  <div class="container mx-auto px-4 py-6 pb-24">

    <div class="card-tech mb-6">
      <h3 class="text-xl font-bold mb-4 text-primary">{{ t('referFriend') }}</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-400">{{ t('myAddress') }}</label>
          <div class="flex gap-2">
            <input
              :value="address || t('connectWalletFirst')"
              readonly
              class="input-tech flex-1"
            />
            <button
              @click="copyToClipboard(address || '')"
              :disabled="!address"
              class="px-4 py-2 bg-gradient-tech rounded-lg font-medium hover:shadow-glow-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ t('copy') }}
            </button>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-400">{{ t('myLink') }}</label>
          <div class="flex gap-2">
            <input
              :value="referralLink"
              readonly
              class="input-tech flex-1 text-sm"
            />
            <button
              @click="copyToClipboard(referralLink)"
              :disabled="!address"
              class="px-4 py-2 bg-gradient-tech rounded-lg font-medium hover:shadow-glow-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ t('copy') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card-tech mb-6">
      <h3 class="text-xl font-bold mb-4 text-primary">{{ t('teamSystem') }}</h3>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-primary-light border border-accent-blue/30 rounded-lg p-4 text-center">
          <div class="text-3xl font-bold text-primary mb-1">{{ directCount }}</div>
          <div class="text-sm text-gray-400">{{ t('directReferrals') }}</div>
        </div>
        <div class="bg-primary-light border border-accent-cyan/30 rounded-lg p-4 text-center">
          <div class="text-3xl font-bold text-primary-dark mb-1">{{ teamCount }}</div>
          <div class="text-sm text-gray-400">{{ t('teamMembers') }}</div>
        </div>
      </div>
    </div>

    <div class="card-tech">
      <h3 class="text-xl font-bold mb-4 text-primary">{{ t('referralList') }}</h3>

      <div v-if="isLoading" class="text-center py-8 text-gray-400">
        {{ t('loading') }}
      </div>

      <div v-else-if="directList.length === 0" class="text-center py-8 text-gray-400">
        {{ address ? t('noDirectReferrals') : t('connectWalletFirst') }}
      </div>

      <div v-else class="space-y-3 mb-4">
        <div
          v-for="(referral, index) in directList"
          :key="referral"
          class="flex items-center justify-between p-3 bg-primary-light border border-accent-blue/30 rounded-lg hover:border-accent-cyan transition-colors"
        >
          <span class="text-sm text-gray-400">{{ index + 1 + currentPage * pageSize }}</span>
          <span class="font-mono text-sm text-gray-300 truncate max-w-[200px]">{{ referral }}</span>
          <button
            @click="copyToClipboard(referral)"
            class="px-3 py-1 text-xs bg-secondary border border-accent-blue/50 rounded hover:border-accent-cyan transition-colors"
          >
            {{ t('copy') }}
          </button>
        </div>
      </div>

      <div v-if="directList.length > 0" class="flex justify-between items-center">
        <button
          @click="previousPage"
          :disabled="currentPage === 0 || isLoading"
          class="px-4 py-2 bg-secondary border border-accent-blue/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-accent-cyan hover:shadow-glow-cyan transition-all"
        >
          {{ t('previous') }}
        </button>
        <span class="text-sm text-gray-400">
          {{ t('page') }} {{ currentPage + 1 }}
        </span>
        <button
          @click="nextPage"
          :disabled="!hasNextPage || isLoading"
          class="px-4 py-2 bg-secondary border border-accent-blue/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-accent-cyan hover:shadow-glow-cyan transition-all"
        >
          {{ t('next') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useWallet } from '../composables/useWallet'
import { useToast } from '../composables/useToast'
import { useMinerStore } from '../stores/miner'
import { t } from '../i18n'

const { address, getSigner, isConnected } = useWallet()
const minerStore = useMinerStore()
const { userInfo, directsList, directsTotal, isLoading } = storeToRefs(minerStore)

const currentPage = ref(0)
const pageSize = 10
const hasNextPage = ref(false)

// 直接从 store 获取数据
const directCount = computed(() => directsTotal.value)
const teamCount = computed(() => userInfo.value?.user.teamEffectiveCnt || 0)
const directList = computed(() => directsList.value)

const referralLink = computed(() => {
  if (!address.value) return ''
  return `${window.location.origin}?ref=${address.value}`
})

// 加载直推列表
async function loadDirects(page: number) {
  const signer = await getSigner()
  if (!address.value || !signer) return

  try {
    const offset = page * pageSize
    const result = await minerStore.fetchDirects(address.value, signer, offset, pageSize)
    hasNextPage.value = result.hasNext
  } catch (error) {
    console.error('Failed to load directs:', error)
    hasNextPage.value = false
  }
}

// 加载直推列表（首页）
// 用户信息和数量由 store 自动刷新
async function loadFirstPageDirects() {
  const signer = await getSigner()
  if (!address.value || !signer) return

  try {
    // 获取直推数量
    await minerStore.fetchDirectsLength(address.value, signer)

    // 加载第一页直推列表
    currentPage.value = 0
    await loadDirects(0)
  } catch (error) {
    console.error('Failed to load directs:', error)
  }
}

// 复制到剪贴板
function copyToClipboard(text: string) {
  const toast = useToast()
  if (!text) return

  const fallbackCopy = () => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      toast.success(t('copiedToClipboard'))
    } catch (err) {
      toast.error(t('copyFailed'))
    } finally {
      document.body.removeChild(textArea)
    }
  }

  if (!navigator.clipboard) {
    fallbackCopy()
    return
  }

  navigator.clipboard.writeText(text).then(() => {
    toast.success(t('copiedToClipboard'))
  }).catch(() => {
    fallbackCopy()
  })
}

// 上一页
async function previousPage() {
  if (currentPage.value > 0) {
    currentPage.value--
    await loadDirects(currentPage.value)
  }
}

// 下一页
async function nextPage() {
  if (hasNextPage.value) {
    currentPage.value++
    await loadDirects(currentPage.value)
  }
}

// 监听钱包连接状态
watch(isConnected, (connected) => {
  if (connected) {
    loadFirstPageDirects()
  } else {
    // 断开连接时重置分页状态（store 会自动清空数据）
    currentPage.value = 0
    hasNextPage.value = false
  }
})

// 组件挂载时加载直推列表
onMounted(() => {
  if (isConnected.value && directsList.value.length === 0) {
    // 只在列表为空时加载，避免重复请求
    loadFirstPageDirects()
  }
})

// Store 会自动监听钱包连接事件并刷新数据
</script>
