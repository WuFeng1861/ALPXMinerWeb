<template>
  <header class="fixed top-0 left-0 right-0 bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-primary/30 z-50">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center">
        <img
          src="https://wufeng98.cn/imgServerApi/images/d33954db-5c32-4554-9cbd-28a2fd144110.png"
          alt="ALPX Logo"
          class="h-10 w-auto"
        />
      </div>

      <div class="flex items-center gap-3">
        <div class="relative" v-if="false">
          <button
            @click="showThemeDropdown = !showThemeDropdown"
            class="px-4 py-2 bg-[#2d2d2d] border-2 border-primary-dark/50 rounded-lg text-sm font-medium hover:border-primary hover:shadow-glow transition-all duration-300 flex items-center gap-2"
          >
            <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: themes[currentTheme].primary }"></span>
            {{ getThemeName(currentTheme) }}
          </button>

          <div
            v-if="showThemeDropdown"
            class="absolute top-full mt-2 right-0 bg-[#1a1a1a] border-2 border-primary/30 rounded-lg overflow-hidden shadow-lg min-w-[120px]"
          >
            <button
              v-for="(theme, key) in themes"
              :key="key"
              @click="selectTheme(key as ThemeType)"
              class="w-full px-4 py-2 hover:bg-[#2d2d2d] transition-colors flex items-center gap-2 text-left"
              :class="{ 'bg-[#2d2d2d]': currentTheme === key }"
            >
              <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: theme.primary }"></span>
              {{ getThemeName(key as ThemeType) }}
            </button>
          </div>
        </div>

        <button
          @click="toggleLanguage"
          class="px-4 py-2 bg-[#2d2d2d] border-2 border-primary-dark/50 rounded-lg text-sm font-medium hover:border-primary hover:shadow-glow transition-all duration-300"
        >
          {{ currentLanguage === 'en' ? 'EN' : '中文' }}
        </button>

        <button
          v-if="!isConnected"
          @click="connectWallet"
          class="btn-tech text-sm"
        >
          {{ t('connect') }}
        </button>

        <button
          v-else
          @click="handleAddressClick"
          class="px-4 py-2 bg-gradient-tech rounded-lg text-sm font-medium shadow-glow hover:opacity-90 transition-opacity cursor-pointer"
        >
          {{ shortAddress }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWallet } from '../composables/useWallet'
import { useTheme, getThemeName, type ThemeType } from '../composables/useTheme'
import { t, currentLanguage, toggleLanguage } from '../i18n'
import { eventBus, EventTypes } from '../utils/eventBus'
import {useMinerStore} from '../stores/miner.ts';

const { isConnected, shortAddress, connectWallet, address, getSigner } = useWallet()
const { currentTheme, themes, setTheme } = useTheme()
const minerStore = useMinerStore()
const showThemeDropdown = ref(false)

const selectTheme = (theme: ThemeType) => {
  setTheme(theme)
  showThemeDropdown.value = false
}

// 点击地址按钮时检查是否绑定上级
const handleAddressClick = async () => {
  if (!address.value) return

  // 加载用户信息
  const signer = await getSigner()
  if (signer) {
    await minerStore.fetchUserInfo(address.value, signer)

    // 如果没有绑定上级，显示绑定弹窗
    if (!minerStore.hasInviter) {
      eventBus.emit(EventTypes.SHOW_BIND_REFERRER_MODAL)
    }
  }
}
</script>
