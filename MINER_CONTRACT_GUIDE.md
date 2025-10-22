# ALPXMiner 合约集成指南

## 合约信息

- **合约地址**: `0xd81f52c3c3ed7d55d369e9199d064c5b30fb8912`
- **网络**: BSC 主网 (Chain ID: 56)

## 核心功能

### 1. 用户管理

#### 绑定上级 (bindInviter)

```typescript
import { useMiner } from '@/composables/useMiner'
import { useWallet } from '@/composables/useWallet'

const { bindInviter } = useMiner()
const { signer } = useWallet()

// 绑定上级地址
const success = await bindInviter('0x上级地址', signer.value)
```

**注意**：
- 上级必须已购买过矿机
- 每个地址只能绑定一次
- 绑定后无法更改

#### 获取用户信息 (userInfo)

```typescript
import { useMiner } from '@/composables/useMiner'

const { fetchUserInfo, userInfo } = useMiner()

// 获取用户信息
await fetchUserInfo(userAddress, provider)

console.log(userInfo.value)
// {
//   user: {
//     inviter: "0x...",           // 上级地址
//     machineCnt: 3,              // 矿机数量
//     teamDaily: 123456n,         // 团队日薪
//     lastClaimTime: 1234567890n, // 上次领取时间
//     pendingTeam: 1000000n,      // 待结算团队奖励
//     offset: 0n,                 // 债务偏移
//     claimedTeam: 5000000n,      // 已领取团队奖励
//     teamEffectiveCnt: 10        // 团队有效人数
//   },
//   totalSpeed: 100000n,          // 总算力
//   totalClaimedSelf: 2000000n    // 已领取矿机奖励
// }
```

### 2. 购买矿机 (buy)

#### 矿机方案

| 模式 | Mode ID | USDT | ALPS | 产出 |
|-----|---------|------|------|------|
| 纯 USDT | 0 | 200 | 0 | 52000 ALPX |
| 混合方案1 | 1 | 100 | 1,000,000 | 52000 ALPX |
| 混合方案2 | 2 | 200 | 0 | 52000 ALPX |

#### 购买流程

```typescript
import { useMinerPurchase } from '@/composables/useMinerPurchase'
import { useWallet } from '@/composables/useWallet'
import { MinerMode } from '@/types'

const { purchaseMiner, isPurchasing, purchaseStep } = useMinerPurchase()
const { address, signer, provider } = useWallet()

// 购买矿机（自动处理授权）
const success = await purchaseMiner(
  MinerMode.USDT_ALPS_MIX,  // 选择方案
  address.value,
  signer.value,
  provider.value
)

// 监听购买进度
watch(purchaseStep, (step) => {
  console.log('当前步骤:', step)
  // "准备购买..." -> "授权 USDT..." -> "授权 ALPS..." -> "购买矿机中..." -> "购买成功！"
})
```

#### 手动授权和购买

```typescript
import { useContract } from '@/composables/useContract'
import { useMiner } from '@/composables/useMiner'
import { CONTRACT_ADDRESSES } from '@/config/contracts'

const { ensureAllowance, parseAmount } = useContract()
const { buyMiner } = useMiner()

// 1. 授权 USDT
const usdtAmount = parseAmount('100', 18) // 100 USDT
await ensureAllowance(
  'USDT',
  userAddress,
  CONTRACT_ADDRESSES.ALPXMiner,
  usdtAmount,
  signer,
  provider
)

// 2. 授权 ALPS
const alpsAmount = parseAmount('1000000', 18) // 1,000,000 ALPS
await ensureAllowance(
  'ALPS',
  userAddress,
  CONTRACT_ADDRESSES.ALPXMiner,
  alpsAmount,
  signer,
  provider
)

// 3. 购买矿机
await buyMiner(1, signer) // mode = 1
```

### 3. 领取收益

#### 领取矿机收益 (claimAllSelf)

```typescript
import { useMiner } from '@/composables/useMiner'

const { claimAllSelf, getPendingSelfAll } = useMiner()

// 查询待领取矿机收益
const pending = await getPendingSelfAll(userAddress, provider)
console.log('待领取:', ethers.formatUnits(pending, 18), 'ALPX')

// 领取所有矿机收益
const success = await claimAllSelf(signer)
```

#### 领取推荐奖励 (claimTeam)

```typescript
import { useMiner } from '@/composables/useMiner'

const { claimTeam, getPendingTeamClaimable } = useMiner()

// 查询待领取推荐奖励
const pending = await getPendingTeamClaimable(userAddress, provider)
console.log('待领取:', ethers.formatUnits(pending, 18), 'ALPX')

// 领取推荐奖励
const success = await claimTeam(signer)
```

### 4. 团队管理

#### 获取直推数量

```typescript
import { useMiner } from '@/composables/useMiner'

const { getDirectsLength } = useMiner()

const count = await getDirectsLength(userAddress, provider)
console.log('直推数量:', count)
```

#### 获取直推列表（分页）

```typescript
import { useMiner } from '@/composables/useMiner'

const { getDirects } = useMiner()

// 获取第1页，每页10条
const result = await getDirects(userAddress, 0, 10, provider)

console.log('直推列表:', result.list)
console.log('是否有下一页:', result.hasNext)

// 获取第2页
if (result.hasNext) {
  const page2 = await getDirects(userAddress, 1, 10, provider)
}
```

## 完整使用示例

### 新用户完整流程

```typescript
import { useWallet } from '@/composables/useWallet'
import { useMiner } from '@/composables/useMiner'
import { useMinerPurchase } from '@/composables/useMinerPurchase'
import { MinerMode } from '@/types'

// 1. 连接钱包
const { connectWallet, address, signer, provider, isConnected } = useWallet()
await connectWallet()

if (!isConnected.value) {
  console.error('请先连接钱包')
  return
}

// 2. 获取用户信息
const { fetchUserInfo, userInfo, hasInviter, hasMiner, bindInviter } = useMiner()
await fetchUserInfo(address.value, provider.value)

// 3. 检查是否需要绑定上级
if (!hasInviter.value) {
  const inviterAddress = '0x上级地址'
  const bound = await bindInviter(inviterAddress, signer.value)

  if (!bound) {
    console.error('绑定上级失败')
    return
  }
}

// 4. 购买矿机
const { purchaseMiner, isPurchasing, purchaseStep } = useMinerPurchase()

const purchased = await purchaseMiner(
  MinerMode.USDT_ALPS_MIX,
  address.value,
  signer.value,
  provider.value
)

if (purchased) {
  console.log('购买成功！')
  // 刷新用户信息
  await fetchUserInfo(address.value, provider.value)
}
```

### 老用户领取收益

```typescript
import { useWallet } from '@/composables/useWallet'
import { useMiner } from '@/composables/useMiner'
import { ethers } from 'ethers'

const { address, signer, provider } = useWallet()
const {
  getPendingSelfAll,
  getPendingTeamClaimable,
  claimAllSelf,
  claimTeam
} = useMiner()

// 查询待领取收益
const selfPending = await getPendingSelfAll(address.value, provider.value)
const teamPending = await getPendingTeamClaimable(address.value, provider.value)

console.log('矿机收益:', ethers.formatUnits(selfPending, 18), 'ALPX')
console.log('推荐奖励:', ethers.formatUnits(teamPending, 18), 'ALPX')

// 领取矿机收益
if (selfPending > 0n) {
  await claimAllSelf(signer.value)
}

// 领取推荐奖励
if (teamPending > 0n) {
  await claimTeam(signer.value)
}
```

## 注意事项

1. **授权操作**
   - 购买矿机前必须先授权相应的代币
   - 建议授权最大额度 (MaxUint256) 以避免重复授权
   - `useMinerPurchase` 会自动处理授权流程

2. **网络要求**
   - 必须连接到 BSC 主网 (Chain ID: 56)
   - 确保钱包有足够的 BNB 作为 gas 费

3. **余额检查**
   - 购买前检查代币余额是否充足
   - 使用 `useBalance` 或 `getTokenBalance` 查询余额

4. **错误处理**
   - 所有合约调用都应包含 try-catch
   - 监听交易状态，提供用户反馈

5. **状态刷新**
   - 购买或领取后及时刷新用户信息
   - 使用事件总线通知其他组件更新

## 相关文件

- `/src/config/contracts.ts` - 合约地址和 ABI
- `/src/composables/useMiner.ts` - 矿机合约交互
- `/src/composables/useMinerPurchase.ts` - 购买流程封装
- `/src/composables/useContract.ts` - 代币授权和管理
- `/src/types/index.ts` - TypeScript 类型定义
