<template>
  <span
    class="formatted-number"
    :title="showTooltip ? fullValue : undefined"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    {{ displayValue }}
  </span>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatNumber, formatNumberWithCommas } from '../utils/formatNumber'

interface Props {
  value: number | string
  decimals?: number
  showFullOnHover?: boolean
  useCommas?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  decimals: 2,
  showFullOnHover: true,
  useCommas: false,
})

const isHovering = ref(false)

const numValue = computed(() => {
  return typeof props.value === 'string' ? parseFloat(props.value) : props.value
})

// 显示值
const displayValue = computed(() => {
  if (isNaN(numValue.value)) return '0'

  // 悬停时显示完整数值（如果启用）
  if (props.showFullOnHover && isHovering.value) {
    return props.useCommas
      ? formatNumberWithCommas(numValue.value, props.decimals)
      : numValue.value.toFixed(props.decimals)
  }

  // 默认显示简写格式
  return formatNumber(numValue.value, props.decimals)
})

// 完整数值（用于 tooltip）
const fullValue = computed(() => {
  if (isNaN(numValue.value)) return '0'
  return props.useCommas
    ? formatNumberWithCommas(numValue.value, props.decimals)
    : numValue.value.toFixed(props.decimals)
})

const showTooltip = computed(() => {
  // 只有当数值大于等于1000时才显示 tooltip
  return props.showFullOnHover && Math.abs(numValue.value) >= 1000
})

function handleMouseEnter() {
  if (props.showFullOnHover) {
    isHovering.value = true
  }
}

function handleMouseLeave() {
  isHovering.value = false
}
</script>

<style scoped>
.formatted-number {
  cursor: default;
  transition: all 0.2s ease;
}

.formatted-number[title]:hover {
  cursor: help;
}
</style>
