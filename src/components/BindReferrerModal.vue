<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="handleClose"
  >
    <div class="card-tech max-w-md w-full">
      <h2 class="text-2xl font-bold text-center mb-6 bg-gradient-tech bg-clip-text text-transparent">
        绑定推荐人
      </h2>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-300">
            推荐人地址
          </label>
          <input
            v-model="referrerAddress"
            type="text"
            placeholder="0x..."
            class="input-tech w-full"
            :disabled="isBinding"
          />
          <p class="text-xs text-gray-400 mt-1">
            * 推荐人必须已购买矿机才能绑定
          </p>
        </div>

        <div v-if="errorMessage" class="text-red-400 text-sm text-center">
          {{ errorMessage }}
        </div>

        <div class="flex gap-3">
          <button
            @click="handleBind"
            :disabled="isBinding || !referrerAddress"
            class="btn-tech flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isBinding ? '绑定中...' : '确认绑定' }}
          </button>
          <button
            @click="handleClose"
            :disabled="isBinding"
            class="flex-1 bg-secondary border-2 border-gray-600 text-white font-semibold py-3 px-6 rounded-lg hover:border-gray-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ethers } from 'ethers'
import { useWallet } from '../composables/useWallet'
import { useMiner } from '../composables/useMiner'
import { t } from '../i18n'

interface Props {
  show: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { getSigner } = useWallet()
const { bindInviter } = useMiner()

const referrerAddress = ref('')
const isBinding = ref(false)
const errorMessage = ref('')
const isVisible = ref(false)

// 监听 show prop
watch(() => props.show, (newVal) => {
  isVisible.value = newVal
  if (newVal) {
    errorMessage.value = ''
  }
})

// 从 URL 获取推荐人参数
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const ref = urlParams.get('ref')
  if (ref && ethers.isAddress(ref)) {
    referrerAddress.value = ref
  }
})

// 验证地址
function validateAddress(address: string): boolean {
  if (!address) {
    errorMessage.value = t('enterReferrerAddress')
    return false
  }

  if (!ethers.isAddress(address)) {
    errorMessage.value = t('invalidAddressFormat')
    return false
  }

  return true
}

// 绑定推荐人
async function handleBind() {
  if (!validateAddress(referrerAddress.value)) return

  const signer = await getSigner()
  if (!signer) {
    errorMessage.value = t('pleaseConnectWallet')
    return
  }

  isBinding.value = true
  errorMessage.value = ''

  try {
    const success = await bindInviter(referrerAddress.value, signer)

    if (success) {
      emit('success')
      handleClose()
    } else {
      errorMessage.value = t('bindFailed')
    }
  } catch (error: any) {
    console.error('Bind inviter error:', error)

    if (error.message?.includes('user rejected')) {
      errorMessage.value = t('userRejected')
    } else if (error.message?.includes('already bound')) {
      errorMessage.value = t('alreadyBound')
    } else if (error.message?.includes('inviter not qualified')) {
      errorMessage.value = t('referrerNotQualified')
    } else {
      errorMessage.value = error.message || t('bindFailedRetry')
    }
  } finally {
    isBinding.value = false
  }
}

// 关闭模态框
function handleClose() {
  if (isBinding.value) return
  isVisible.value = false
  emit('close')
}
</script>
