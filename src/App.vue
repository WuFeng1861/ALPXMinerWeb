<template>
  <div id="app" class="max-w-[100vw] overflow-x-hidden">
    <Header />
    <main class="pt-16 pb-20 min-h-screen max-w-[100vw] overflow-x-hidden">
      <router-view />
    </main>
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import BottomNav from './components/BottomNav.vue'
</script>
