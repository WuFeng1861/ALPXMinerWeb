<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold mb-4">格式化测试页面</h1>

    <div class="card-tech">
      <h2 class="text-xl font-bold mb-4">余额格式化测试</h2>
      <div class="space-y-3">
        <div v-for="test in testCases" :key="test.label" class="flex justify-between p-3 bg-[#2a2a2a] rounded-lg">
          <span class="text-gray-300">{{ test.label }} ({{ test.value }})</span>
          <span class="font-bold text-primary">
            <FormattedNumber :value="test.value" />
          </span>
        </div>
      </div>
    </div>

    <div class="card-tech">
      <h2 class="text-xl font-bold mb-4">直接调用函数测试</h2>
      <div class="space-y-2">
        <div v-for="test in testCases" :key="test.label + '_direct'" class="flex justify-between p-2 bg-[#2a2a2a] rounded">
          <span class="text-gray-300">{{ test.label }}</span>
          <span class="font-bold text-primary">{{ formatNumber(test.value) }}</span>
        </div>
      </div>
    </div>

    <div class="card-tech">
      <h2 class="text-xl font-bold mb-4">实际余额模拟</h2>
      <div class="space-y-3">
        <div class="flex justify-between p-3 bg-[#2a2a2a] rounded-lg">
          <span>USDT</span>
          <span class="font-bold text-primary">
            <FormattedNumber :value="1234.56" />
          </span>
        </div>
        <div class="flex justify-between p-3 bg-[#2a2a2a] rounded-lg">
          <span>ALPX</span>
          <span class="font-bold text-primary">
            <FormattedNumber :value="5000000" />
          </span>
        </div>
        <div class="flex justify-between p-3 bg-[#2a2a2a] rounded-lg">
          <span>ALPS</span>
          <span class="font-bold text-primary">
            <FormattedNumber :value="1500000000" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FormattedNumber from '../components/FormattedNumber.vue'
import { formatNumber } from '../utils/formatNumber'

const testCases = ref([
  { label: '零', value: 0 },
  { label: '小数', value: 0.1234 },
  { label: '百位', value: 123.45 },
  { label: '千位', value: 1234.56 },
  { label: '万位', value: 12345.67 },
  { label: '十万', value: 123456.78 },
  { label: '百万', value: 1234567.89 },
  { label: '千万', value: 12345678.90 },
  { label: '亿', value: 123456789.01 },
  { label: '十亿', value: 1234567890.12 },
])
</script>
