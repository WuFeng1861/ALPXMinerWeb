# 数字格式化使用指南

## 功能说明

项目已实现代币余额的智能格式化显示，使用 K、M、B 等单位简写大数值。

## 格式化规则

| 数值范围 | 显示格式 | 示例 |
|---------|---------|------|
| < 1 | 保留4位小数 | 0.1234 |
| 1 - 999 | 保留2位小数 | 123.45 |
| 1,000 - 999,999 | X.XXK | 1.23K, 50.00K |
| 1,000,000 - 99,999,999 | X.XXM | 1.23M, 50.00M |
| ≥ 100,000,000 | X.XXB | 0.10B, 1.23B |

## 使用方法

### 1. 在模板中使用 FormattedNumber 组件

```vue
<template>
  <FormattedNumber :value="balances.usdt" />
</template>
```

### 2. 组件属性

```typescript
interface Props {
  value: number | string        // 数值（必填）
  decimals?: number            // 小数位数（默认: 2）
  showFullOnHover?: boolean    // 悬停显示完整数值（默认: true）
  useCommas?: boolean          // 使用千分位分隔符（默认: false）
}
```

### 3. 使用示例

```vue
<template>
  <!-- 基本使用 -->
  <FormattedNumber :value="1234567" />
  <!-- 输出: 1.23M -->

  <!-- 悬停显示完整数值带千分位 -->
  <FormattedNumber :value="1234567" :use-commas="true" />
  <!-- 输出: 1.23M，悬停显示: 1,234,567.00 -->

  <!-- 自定义小数位数 -->
  <FormattedNumber :value="1234.5678" :decimals="4" />
  <!-- 输出: 1.23K -->
</template>
```

### 4. 直接使用格式化函数

```typescript
import { formatNumber, formatNumberWithCommas } from '@/utils/formatNumber'

// 简写格式
const formatted = formatNumber(1234567) // "1.23M"

// 千分位格式
const withCommas = formatNumberWithCommas(1234567) // "1,234,567.00"
```

## 测试页面

访问 `/test` 路由可以查看所有格式化效果的测试页面。

```
http://localhost:5173/test
```

## 实际应用场景

### 首页余额显示

```vue
<template>
  <div class="balance-item">
    <span>USDT</span>
    <span class="amount">
      <FormattedNumber :value="balances.usdt" :use-commas="true" />
    </span>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useBalanceStore } from '@/stores/balance'
import FormattedNumber from '@/components/FormattedNumber.vue'

const balanceStore = useBalanceStore()
const { balances } = storeToRefs(balanceStore)
</script>
```

### 效果说明

- **简洁展示**：大额数字自动使用 K/M/B 简写
- **精确查看**：鼠标悬停可查看完整数值
- **响应灵敏**：实时格式化，无延迟
- **类型安全**：完整的 TypeScript 类型支持

## 注意事项

1. `useBalance` 返回的是 `number` 类型，由组件负责格式化
2. 组件会自动处理字符串和数字类型
3. 悬停功能只在数值 ≥ 1000 时启用
4. NaN 值会显示为 "0"
