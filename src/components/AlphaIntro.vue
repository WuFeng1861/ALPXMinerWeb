<template>
  <div class="alpha-intro">
    <details class="card-tech">
      <summary class="text-lg font-bold cursor-pointer text-primary hover:text-primary-dark transition-colors">
        {{ t('alphaIntro') }}
      </summary>
      <div class="mt-4 space-y-4">
        <div class="intro-section">
          <p class="text-sm text-gray-300 leading-relaxed">
            {{ t('alphaIntroText') }}
          </p>
        </div>

        <div class="space-y-3">
          <details class="bg-[#2a2a2a] rounded-lg border border-[#00a3ff]/30">
            <summary class="cursor-pointer p-3 hover:bg-[#333] transition-colors flex items-center gap-3">
              <div class="flex-shrink-0 w-8 h-8 bg-cyan-900/50 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 class="text-sm font-semibold text-white">
                {{ t('zeroWalletMining') }}
              </h3>
            </summary>
            <div class="px-3 pb-3 pl-14">
              <p class="text-xs text-gray-400 leading-relaxed">
                {{ t('zeroWalletMiningText') }}
              </p>
            </div>
          </details>

          <details class="bg-[#2a2a2a] rounded-lg border border-[#00a3ff]/30">
            <summary class="cursor-pointer p-3 hover:bg-[#333] transition-colors flex items-center gap-3">
              <div class="flex-shrink-0 w-8 h-8 bg-green-900/50 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-sm font-semibold text-white">
                {{ t('multiDimensionalRevenue') }}
              </h3>
            </summary>
            <div class="px-3 pb-3 pl-14">
              <p class="text-xs text-gray-400 leading-relaxed">
                {{ t('multiDimensionalRevenueText') }}
              </p>
            </div>
          </details>

          <details class="bg-[#2a2a2a] rounded-lg border border-[#00a3ff]/30">
            <summary class="cursor-pointer p-3 hover:bg-[#333] transition-colors flex items-center gap-3">
              <div class="flex-shrink-0 w-8 h-8 bg-purple-900/50 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 class="text-sm font-semibold text-white">
                {{ t('cuttingEdgeTech') }}
              </h3>
            </summary>
            <div class="px-3 pb-3 pl-14">
              <p class="text-xs text-gray-400 leading-relaxed">
                {{ t('cuttingEdgeTechText') }}
              </p>
            </div>
          </details>

          <details class="bg-[#2a2a2a] rounded-lg border border-[#00a3ff]/30">
            <summary class="cursor-pointer p-3 hover:bg-[#333] transition-colors flex items-center gap-3">
              <div class="flex-shrink-0 w-8 h-8 bg-orange-900/50 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="text-sm font-semibold text-white">
                {{ t('binanceEcosystem') }}
              </h3>
            </summary>
            <div class="px-3 pb-3 pl-14">
              <p class="text-xs text-gray-400 leading-relaxed">
                {{ t('binanceEcosystemText') }}
              </p>
            </div>
          </details>
        </div>

        <div class="links-section pt-4 border-t border-[#00a3ff]/30">
          <h3 class="text-base font-semibold text-primary mb-3 text-center">
            {{ t('learnMore') }}
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            <a
              href="https://network.alpha.sc.cn"
              target="_blank"
              rel="noopener noreferrer"
              class="link-card bg-[#2a2a2a] rounded-lg p-3 text-center hover:bg-[#333] transition-colors border border-[#00a3ff]/30 hover:border-cyan-500/50"
            >
              <div class="text-xs text-cyan-400 font-medium">{{ t('officialWebsite') }}</div>
            </a>

            <a
              href="https://t.me/Alpha_ac_an"
              target="_blank"
              rel="noopener noreferrer"
              class="link-card bg-[#2a2a2a] rounded-lg p-3 text-center hover:bg-[#333] transition-colors border border-[#00a3ff]/30 hover:border-blue-500/50"
            >
              <div class="text-xs text-blue-400 font-medium">{{ t('globalTelegram') }}</div>
            </a>

            <a
              href="https://chain.alpha.sc.cn/"
              target="_blank"
              rel="noopener noreferrer"
              class="link-card bg-[#2a2a2a] rounded-lg p-3 text-center hover:bg-[#333] transition-colors border border-[#00a3ff]/30 hover:border-green-500/50"
            >
              <div class="text-xs text-green-400 font-medium">{{ t('blockchain') }}</div>
            </a>

            <a
              href="https://alpha-20.gitbook.io/alpha"
              target="_blank"
              rel="noopener noreferrer"
              class="link-card bg-[#2a2a2a] rounded-lg p-3 text-center hover:bg-[#333] transition-colors border border-[#00a3ff]/30 hover:border-purple-500/50"
            >
              <div class="text-xs text-purple-400 font-medium">{{ t('whitepaper') }}</div>
            </a>
          </div>
        </div>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import { t } from '../i18n'
</script>

<style scoped>
.link-card {
  transition: all 0.3s ease;
}

.link-card:hover {
  transform: translateY(-2px);
}
</style>
