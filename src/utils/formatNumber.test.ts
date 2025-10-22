/**
 * formatNumber 函数测试示例
 *
 * 这个文件展示了不同数值的格式化结果
 */

import { formatNumber, formatNumberWithCommas, smartFormatNumber } from './formatNumber'

// 测试用例
const testCases = [
  // 小数
  { input: 0.1234, expected: '0.1234' },
  { input: 0.001, expected: '0.0010' },

  // 百位以下
  { input: 123.45, expected: '123.45' },
  { input: 999.99, expected: '999.99' },

  // 千位 (K)
  { input: 1000, expected: '1.00K' },
  { input: 1234, expected: '1.23K' },
  { input: 9999, expected: '10.00K' },
  { input: 50000, expected: '50.00K' },
  { input: 999999, expected: '1000.00K' },

  // 百万 (M)
  { input: 1000000, expected: '1.00M' },
  { input: 1234567, expected: '1.23M' },
  { input: 50000000, expected: '50.00M' },
  { input: 99999999, expected: '100.00M' },

  // 十亿 (B)
  { input: 100000000, expected: '0.10B' },
  { input: 1000000000, expected: '1.00B' },
  { input: 1234567890, expected: '1.23B' },
]

console.log('=== formatNumber 测试结果 ===\n')

testCases.forEach(({ input, expected }) => {
  const result = formatNumber(input)
  const status = result === expected ? '✓' : '✗'
  console.log(`${status} ${input.toLocaleString()} => ${result} (期望: ${expected})`)
})

// 实际使用示例
console.log('\n=== 实际应用示例 ===\n')

const balances = {
  usdt: 1234.56,
  alpx: 5000000,
  alps: 1500000000,
}

console.log('USDT 余额:', formatNumber(balances.usdt))  // 1234.57
console.log('ALPX 余额:', formatNumber(balances.alpx))  // 5.00M
console.log('ALPS 余额:', formatNumber(balances.alps))  // 1.50B

// 带千分位的格式化
console.log('\n=== 千分位格式化 ===\n')
console.log('1234567.89 =>', formatNumberWithCommas(1234567.89))  // 1,234,567.89
console.log('1000000 =>', formatNumberWithCommas(1000000))  // 1,000,000.00

// 智能格式化
console.log('\n=== 智能格式化 ===\n')
console.log('小额:', smartFormatNumber(123.45))  // 123.45
console.log('大额简写:', smartFormatNumber(1234567))  // 1.23M
console.log('大额千分位:', smartFormatNumber(1234567, { useShortFormat: false, useCommas: true }))  // 1,234,567.00
