<template>
  <div class="container mx-auto px-4 py-6 pb-24">

    <div class="card-tech mb-6">
      <h3 class="text-xl font-bold mb-4 text-primary">
        {{ t('miningReward') }}
        <span class="text-base text-gray-400">({{ miningReward.minerCount }} 台)</span>
      </h3>

      <div class="space-y-4">
        <div class="bg-primary-light border border-accent-blue/30 rounded-lg p-4">
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm text-gray-400">{{ t('hashrate') }}</span>
            <span class="text-base font-bold text-primary">
              <FormattedNumber :value="miningReward.hashrate * 3600" /> ALPX/hs
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-400">{{ t('pending') }}</span>
            <span class="text-lg font-bold text-primary-dark">
              <FormattedNumber :value="miningReward.pending" /> ALPX
            </span>
          </div>
        </div>

        <button
          @click="handleClaimSelf"
          :disabled="isClaimingSelf || miningReward.pending === 0"
          class="btn-tech w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isClaimingSelf ? t('Claiming') : t('claim') }}
        </button>
      </div>
    </div>

    <div class="card-tech">
      <h3 class="text-xl font-bold mb-4 text-primary">
        {{ t('referralReward') }}
        <span class="text-base text-gray-400">(<FormattedNumber :value="referralReward.total" /> ALPX)</span>
      </h3>

      <div class="space-y-4">
        <div class="bg-primary-light border border-accent-blue/30 rounded-lg p-4">
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm text-gray-400">{{ t('teamHashrate') }}</span>
            <span class="text-base font-bold text-primary">
              <FormattedNumber :value="referralReward.teamHashrate * 3600" /> ALPX/hs
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-400">{{ t('pending') }}</span>
            <span class="text-lg font-bold text-primary-dark">
              <FormattedNumber :value="referralReward.pending" /> ALPX
            </span>
          </div>
        </div>

        <button
          @click="handleClaimTeam"
          :disabled="isClaimingTeam || referralReward.pending === 0"
          class="btn-tech w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isClaimingTeam ? '领取中...' : t('claim') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { ethers } from 'ethers'
import { t } from '../i18n'
import { useWallet } from '../composables/useWallet'
import { useMinerStore } from '../stores/miner'
import { useMiner } from '../composables/useMiner'
import { eventBus, EventTypes } from '../utils/eventBus'
import FormattedNumber from '../components/FormattedNumber.vue'

interface MiningReward {
  minerCount: number
  hashrate: number
  pending: number
}

interface ReferralReward {
  total: number
  teamHashrate: number
  pending: number
}

const { getSigner } = useWallet()
const minerStore = useMinerStore()
const { userInfo, pendingSelf, pendingTeam } = storeToRefs(minerStore)
const { claimAllSelf, claimTeam } = useMiner()

// 从 store 计算数据（userInfo 等已经是 ref，可以直接使用 .value）
const miningReward = computed<MiningReward>(() => ({
  minerCount: userInfo.value?.user.machineCnt || 0,
  hashrate: userInfo.value ? Number(ethers.formatUnits(userInfo.value.totalSpeed, 18)) : 0,
  pending: Number(ethers.formatUnits(pendingSelf.value, 18)),
}))

const referralReward = computed<ReferralReward>(() => ({
  total: userInfo.value ? Number(ethers.formatUnits(userInfo.value.user.claimedTeam, 18)) : 0,
  teamHashrate: userInfo.value ? Number(ethers.formatUnits(userInfo.value.user.teamDaily, 18)) : 0,
  pending: Number(ethers.formatUnits(pendingTeam.value, 18)),
}))

const isClaimingSelf = ref(false)
const isClaimingTeam = ref(false)

// 数据自动从 store 获取，无需手动加载

// 领取矿机收益
async function handleClaimSelf() {
  const signer = await getSigner()
  if (!signer || isClaimingSelf.value) return

  isClaimingSelf.value = true

  try {
    const success = await claimAllSelf(signer)

    if (success) {
      // claimAllSelf 会自动刷新 store 数据
      // 通知余额更新
      eventBus.emit(EventTypes.BALANCE_UPDATE)
    }
  } catch (error) {
    console.error('Failed to claim self rewards:', error)
  } finally {
    isClaimingSelf.value = false
  }
}

// 领取推荐奖励
async function handleClaimTeam() {
  const signer = await getSigner()
  if (!signer || isClaimingTeam.value) return

  isClaimingTeam.value = true

  try {
    const success = await claimTeam(signer)

    if (success) {
      // claimTeam 会自动刷新 store 数据
      // 通知余额更新
      eventBus.emit(EventTypes.BALANCE_UPDATE)
    }
  } catch (error) {
    console.error('Failed to claim team rewards:', error)
  } finally {
    isClaimingTeam.value = false
  }
}

// Store 会自动处理数据刷新，无需手动监听
</script>
