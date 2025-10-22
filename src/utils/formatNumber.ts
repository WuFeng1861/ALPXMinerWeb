/**
 * 格式化数字，使用 K、M、B 等单位简写
 * @param value 数字值
 * @param decimals 保留小数位数
 * @returns 格式化后的字符串
 */
export function formatNumber(value: number | string, decimals: number = 2): string {
  const num = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(num)) return '0'

  // 处理负数
  const sign = num < 0 ? '-' : ''
  const absNum = Math.abs(num)

  // 1亿及以上 (100M+)
  if (absNum >= 100_000_000) {
    return sign + (absNum / 1_000_000_000).toFixed(decimals) + 'B'
  }
  // 1千万及以上 (10M+)
  if (absNum >= 10_000_000) {
    return sign + (absNum / 1_000_000).toFixed(decimals) + 'M'
  }
  // 100万及以上 (1M+)
  if (absNum >= 1_000_000) {
    return sign + (absNum / 1_000_000).toFixed(decimals) + 'M'
  }
  // 10万及以上 (100K+)
  if (absNum >= 100_000) {
    return sign + (absNum / 1_000).toFixed(decimals) + 'K'
  }
  // 1万及以上 (10K+)
  if (absNum >= 10_000) {
    return sign + (absNum / 1_000).toFixed(decimals) + 'K'
  }
  // 1千及以上 (1K+)
  if (absNum >= 1_000) {
    return sign + (absNum / 1_000).toFixed(decimals) + 'K'
  }

  // 小于1000，直接显示
  if (absNum >= 1) {
    return sign + absNum.toFixed(decimals)
  }

  // 小于1，保留更多小数位
  if (absNum > 0) {
    return sign + absNum.toFixed(4)
  }

  return '0'
}

/**
 * 格式化数字，添加千分位分隔符
 * @param value 数字值
 * @param decimals 保留小数位数
 * @returns 格式化后的字符串
 */
export function formatNumberWithCommas(value: number | string, decimals: number = 2): string {
  const num = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(num)) return '0'

  const parts = num.toFixed(decimals).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return parts.join('.')
}

/**
 * 智能格式化数字
 * 根据数值大小自动选择最佳显示方式
 * @param value 数字值
 * @param options 选项
 * @returns 格式化后的字符串
 */
export function smartFormatNumber(
  value: number | string,
  options?: {
    decimals?: number
    useShortFormat?: boolean
    useCommas?: boolean
  }
): string {
  const {
    decimals = 2,
    useShortFormat = true,
    useCommas = false,
  } = options || {}

  const num = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(num)) return '0'

  // 大数使用简写
  if (useShortFormat && Math.abs(num) >= 1_000) {
    return formatNumber(num, decimals)
  }

  // 使用千分位
  if (useCommas) {
    return formatNumberWithCommas(num, decimals)
  }

  // 默认格式
  return num.toFixed(decimals)
}
