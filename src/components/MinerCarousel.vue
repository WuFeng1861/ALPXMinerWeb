<template>
  <div class="relative w-full py-12 overflow-hidden">
    <div class="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
      <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="80" y="120" width="240" height="160" rx="8" fill="url(#minerGradient)" stroke="#00ffff" stroke-width="2"/>
        <rect x="100" y="140" width="80" height="60" rx="4" fill="#0a0a0a" stroke="#00a3ff" stroke-width="1.5"/>
        <rect x="200" y="140" width="80" height="60" rx="4" fill="#0a0a0a" stroke="#00a3ff" stroke-width="1.5"/>
        <circle cx="140" cy="170" r="15" fill="#00ffff" opacity="0.3"/>
        <circle cx="240" cy="170" r="15" fill="#00a3ff" opacity="0.3"/>
        <line x1="120" y1="220" x2="280" y2="220" stroke="#00ffff" stroke-width="2" stroke-linecap="round"/>
        <line x1="140" y1="235" x2="260" y2="235" stroke="#00a3ff" stroke-width="2" stroke-linecap="round"/>
        <line x1="160" y1="250" x2="240" y2="250" stroke="#00ffff" stroke-width="2" stroke-linecap="round"/>
        <defs>
          <linearGradient id="minerGradient" x1="80" y1="120" x2="320" y2="280">
            <stop offset="0%" stop-color="#1a1a1a"/>
            <stop offset="100%" stop-color="#2d2d2d"/>
          </linearGradient>
        </defs>
      </svg>
    </div>

    <div class="relative perspective-1000 overflow-hidden">
      <div class="relative flex items-center justify-center overflow-hidden" :style="{ height: containerHeight }">
        <div
          v-for="(miner, index) in miners"
          :key="miner.id"
          class="absolute transition-all duration-700 ease-out cursor-pointer"
          :style="getCardStyle(index)"
          @click="goTo(index)"
        >
          <div
            class="card-tech relative overflow-hidden"
            :class="{
              'shadow-glow-cyan': index === currentIndex,
            }"
            :style="cardSize"
          >
            <div class="absolute top-0 right-0 px-3 py-1 bg-gradient-tech text-xs font-bold rounded-bl-lg z-10">
              {{ t('plan') }} {{ index + 1 }}
            </div>

            <div class="flex flex-col h-full sm:p-5">
              <div class="text-center mb-4 mt-6">
                <div class="flex items-center justify-center gap-2 mb-3">
                  <div class="text-3xl sm:text-4xl font-bold bg-gradient-tech bg-clip-text text-transparent">
                    {{ miner.usdt }}
                  </div>
                  <div class="flex items-center gap-1 px-2 py-1 bg-[#1a1a1a]/70 rounded-lg border border-[#00a3ff]/30">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="#00a3ff" stroke-width="2"/>
                      <text x="12" y="16" text-anchor="middle" fill="#00ffff" font-size="12" font-weight="bold">U</text>
                    </svg>
                    <span class="text-xs font-medium text-white">USDT</span>
                  </div>
                </div>
                <div v-if="miner.alps > 0" class="flex items-center justify-center gap-1.5 text-sm">
                  <span class="text-gray-400">+</span>
                  <span class="font-bold text-primary">{{ (miner.alps / 1000000).toFixed(1) }}M</span>
                  <div class="flex items-center gap-1 px-1.5 py-0.5 bg-gradient-tech/20 rounded border border-[#00ffff]/20">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#00ffff" stroke-width="2" stroke-linejoin="round"/>
                      <path d="M2 17L12 22L22 17" stroke="#00a3ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="#00a3ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="text-xs font-medium text-primary">ALPS</span>
                  </div>
                </div>
              </div>

              <div class="flex-1 grid grid-cols-2 gap-2 mb-4">
                <div class="bg-[#1a1a1a]/50 backdrop-blur-sm rounded-lg p-2.5 border border-[#00a3ff]/30">
                  <div class="text-xs text-gray-400 mb-1">{{ t('expectedOutput') }}</div>
                  <div class="text-primary font-bold text-sm">{{ miner.production }}</div>
                </div>

                <div class="bg-[#1a1a1a]/50 backdrop-blur-sm rounded-lg p-2.5 border border-[#00ffff]/30">
                  <div class="text-xs text-gray-400 mb-1">{{ t('hashrate') }}</div>
                  <div class="text-primary-dark font-bold text-sm">1.188 ALPX/hs</div>
                </div>

                <div class="bg-[#1a1a1a]/50 backdrop-blur-sm rounded-lg p-2.5 border border-[#00a3ff]/30">
                  <div class="text-xs text-gray-400 mb-1">{{ t('runtime') }}</div>
                  <div class="text-white font-bold text-sm">5 {{ t('years') }}</div>
                </div>

                <div class="bg-[#1a1a1a]/50 backdrop-blur-sm rounded-lg p-2.5 border border-[#00ffff]/20">
                  <div class="text-xs text-gray-400 mb-1">{{ t('bindPermission') }}</div>
                  <div class="text-primary font-bold text-sm flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                    </svg>
                    <span>{{ t('enableDownline') }}</span>
                  </div>
                </div>
              </div>

              <button
                v-if="index === currentIndex"
                @click.stop="$emit('buy', miner)"
                class="btn-tech w-full text-base sm:text-lg py-3 sm:py-4"
              >
                {{ t('buyNow') }}
              </button>
              <button
                v-else
                @click.stop="goTo(index)"
                class="w-full py-2.5 sm:py-3 bg-[#2d2d2d] border-2 border-primary-dark/50 rounded-lg text-primary text-sm font-medium hover:border-primary transition-all duration-300"
              >
                {{ t('viewDetails') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        @click="prev"
        class="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-[#2d2d2d]/90 backdrop-blur-sm border-2 border-[#00a3ff]/50 rounded-full flex items-center justify-center hover:border-[#00ffff] hover:shadow-glow-cyan transition-all duration-300 z-40"
      >
        <svg class="w-5 h-5 sm:w-7 sm:h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        @click="next"
        class="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-[#2d2d2d]/90 backdrop-blur-sm border-2 border-[#00a3ff]/50 rounded-full flex items-center justify-center hover:border-[#00ffff] hover:shadow-glow-cyan transition-all duration-300 z-40"
      >
        <svg class="w-5 h-5 sm:w-7 sm:h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <div class="flex justify-center gap-3 mt-8">
      <button
        v-for="(_, index) in miners"
        :key="index"
        @click="goTo(index)"
        class="transition-all duration-300"
        :class="index === currentIndex
          ? 'w-10 h-2.5 bg-gradient-tech rounded-full shadow-glow-cyan'
          : 'w-2.5 h-2.5 bg-[#2d2d2d] border border-[#00a3ff]/50 rounded-full hover:bg-[#00a3ff]/30'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MinerCard } from '../types'
import { t } from '../i18n'

const props = defineProps<{
  miners: MinerCard[]
}>()

defineEmits<{
  buy: [miner: MinerCard]
}>()

const currentIndex = ref(0)

const isMobile = computed(() => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 640
})

const cardSize = computed(() => {
  if (isMobile.value) {
    return { width: '240px', height: '400px' }
  }
  return { width: '280px', height: '440px' }
})

const containerHeight = computed(() => {
  return isMobile.value ? '450px' : '500px'
})

const getCardStyle = computed(() => {
  return (index: number) => {
    const position = index - currentIndex.value
    const mobile = isMobile.value

    if (position === 0) {
      return {
        transform: 'translateX(0) translateZ(0) rotateY(0deg) scale(1)',
        zIndex: 30,
        opacity: 1,
      }
    } else if (position === -1) {
      if (mobile) {
        return {
          transform: 'translateX(-75%) translateZ(-100px) rotateY(35deg) scale(0.75)',
          zIndex: 20,
          opacity: 0.65,
        }
      }
      return {
        transform: 'translateX(-75%) translateZ(-150px) rotateY(30deg) scale(0.85)',
        zIndex: 20,
        opacity: 0.7,
      }
    } else if (position === 1) {
      if (mobile) {
        return {
          transform: 'translateX(75%) translateZ(-100px) rotateY(-35deg) scale(0.75)',
          zIndex: 20,
          opacity: 0.65,
        }
      }
      return {
        transform: 'translateX(75%) translateZ(-150px) rotateY(-30deg) scale(0.85)',
        zIndex: 20,
        opacity: 0.7,
      }
    } else if (position < -1) {
      return {
        transform: mobile
          ? 'translateX(-150%) translateZ(-200px) rotateY(45deg) scale(0.6)'
          : 'translateX(-140%) translateZ(-250px) rotateY(40deg) scale(0.7)',
        zIndex: 10,
        opacity: 0.2,
      }
    } else {
      return {
        transform: mobile
          ? 'translateX(150%) translateZ(-200px) rotateY(-45deg) scale(0.6)'
          : 'translateX(140%) translateZ(-250px) rotateY(-40deg) scale(0.7)',
        zIndex: 10,
        opacity: 0.2,
      }
    }
  }
})

function next() {
  currentIndex.value = (currentIndex.value + 1) % props.miners.length
}

function prev() {
  currentIndex.value = (currentIndex.value - 1 + props.miners.length) % props.miners.length
}

function goTo(index: number) {
  currentIndex.value = index
}
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
  transform-style: preserve-3d;
}
</style>
