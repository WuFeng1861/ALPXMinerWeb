// 矿机方案
export interface MinerCard {
  id: number
  usdt: number
  alps: number
  production: string
}

// 代币余额
export interface TokenBalance {
  usdt: string
  alpx: string
  alps: string
}

// 推荐信息
export interface ReferralInfo {
  directCount: number
  teamCount: number
  referrals: string[]
}

// 矿机收益
export interface MiningReward {
  minerCount: number
  hashrate: string
  pending: string
}

// 推荐奖励
export interface ReferralReward {
  total: string
  teamHashrate: string
  pending: string
}

// 购买矿机的模式
export enum MinerMode {
  USDT_ONLY = 1,      // 纯 USDT
  USDT_ALPS_MIX = 2,  // USDT + ALPS 混合
  USDT_ALPS_MIX2 = 3, // USDT + ALPS 混合方案2
}

// 矿机方案配置
export interface MinerPlan {
  mode: MinerMode
  name: string
  usdt: number
  alps: number
  production: string
  description: string
}
