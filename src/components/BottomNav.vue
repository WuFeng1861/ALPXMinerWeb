<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-[#1a1a1a]/95 backdrop-blur-sm border-t border-[#00ffff]/30 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-end justify-around py-2 pb-3">
        <router-link
          to="/team"
          class="flex flex-col items-center gap-1 py-2 px-4 transition-all duration-300"
          :class="$route.path === '/team' ? 'text-primary' : 'text-gray-400 hover:text-primary-dark'"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span class="text-xs font-medium">{{ t('team') }}</span>
        </router-link>

        <router-link
          to="/"
          class="relative flex flex-col items-center -mt-6 transition-all duration-300"
        >
          <div
            class="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
            :class="$route.path === '/' ? 'bg-gradient-tech shadow-glow-cyan scale-110' : 'bg-[#2d2d2d] border-2 border-primary-dark/50'"
          >
            <img
              src="https://wufeng98.cn/imgServerApi/images/d33954db-5c32-4554-9cbd-28a2fd144110.png"
              alt="ALPX"
              class="w-12 h-12 rounded-full"
            />
          </div>
          <span
            class="text-xs font-medium mt-1"
            :class="$route.path === '/' ? 'text-primary' : 'text-gray-400'"
          >
            {{ t('home') }}
          </span>
        </router-link>

        <router-link
          to="/mine"
          class="flex flex-col items-center gap-1 py-2 px-4 transition-all duration-300"
          :class="$route.path === '/mine' ? 'text-primary' : 'text-gray-400 hover:text-primary-dark'"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="text-xs font-medium">{{ t('mine') }}</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { t } from '../i18n'
</script>
