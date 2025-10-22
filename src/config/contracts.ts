// 代币合约地址配置
export const CONTRACT_ADDRESSES = {
  ALPX: '0xbc89cbe2bbf85a204fe6cf1b500b60964ec54f1b',
  ALPS: '0x258948986c19ea2915E48a5D7a475dfE2B86E893',
  USDT: '0x55d398326f99059fF775485246999027B3197955',
  ALPXMiner: '0x48f7139Cabd525A1A9E4ba0E8ae6663e7b9542EF',
} as const

// ERC20 标准 ABI（用于查询余额和授权）
export const ERC20_ABI = [
  // 查询余额
  'function balanceOf(address owner) view returns (uint256)',
  // 查询授权额度
  'function allowance(address owner, address spender) view returns (uint256)',
  // 授权
  'function approve(address spender, uint256 amount) returns (bool)',
  // 转账
  'function transfer(address to, uint256 amount) returns (bool)',
  // 代币符号
  'function symbol() view returns (string)',
  // 代币名称
  'function name() view returns (string)',
  // 小数位数
  'function decimals() view returns (uint8)',
  // 总供应量
  'function totalSupply() view returns (uint256)',
] as const

// ALPXMiner ABI
export const ALPXMiner_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "inviter",
				"type": "address"
			}
		],
		"name": "bindInviter",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "mode",
				"type": "uint8"
			}
		],
		"name": "buy",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_usdt",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_alps",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_alpx",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "inviter",
				"type": "address"
			}
		],
		"name": "BindInviter",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "idx",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "mode",
				"type": "uint8"
			}
		],
		"name": "Buy",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "buyOwner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "claimAllSelf",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "idx",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "ClaimSelf",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "claimTeam",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "ClaimTeam",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "add",
				"type": "uint256"
			}
		],
		"name": "ownerAddSoldSupply",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "sub",
				"type": "uint256"
			}
		],
		"name": "ownerSubSoldSupply",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "rescueToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "RescueToken",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdrawEth",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ALPS",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ALPX",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "claimedTotal",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "selfTotal",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "teamTotal",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "allTotal",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "page",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pageSize",
				"type": "uint256"
			}
		],
		"name": "directs",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "list",
				"type": "address[]"
			},
			{
				"internalType": "bool",
				"name": "hasNext",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "directsLen",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "directsLength",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DURATION_SECONDS",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "idx",
				"type": "uint256"
			}
		],
		"name": "getPendingSelf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getTeamEffectiveCnt",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "machines",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "buyTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "claimedSelf",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MAX_SUPPLY",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "pendingSelfAll",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amt",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "pendingTeam",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "pendingTeamClaimable",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amt",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "PRICE_ALPS_MIX",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "PRICE_ALPS_MIX2",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "PRICE_USDT_MIX",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "PRICE_USDT_ONLY",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "REF_RATE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "remainingSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "SECONDLY_REWARD",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "soldSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "TOTAL_REWARD",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "USDT",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "userInfo",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "inviter",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "machineCnt",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "teamDaily",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "lastClaimTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "pendingTeam",
						"type": "uint256"
					},
					{
						"internalType": "int256",
						"name": "offset",
						"type": "int256"
					},
					{
						"internalType": "uint256",
						"name": "claimedTeam",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "teamEffectiveCnt",
						"type": "uint256"
					}
				],
				"internalType": "struct ALPXMiner.User",
				"name": "u",
				"type": "tuple"
			},
			{
				"internalType": "uint256",
				"name": "totalSpeed",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalClaimedSelf",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "address",
				"name": "inviter",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "machineCnt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "teamDaily",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastClaimTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pendingTeam",
				"type": "uint256"
			},
			{
				"internalType": "int256",
				"name": "offset",
				"type": "int256"
			},
			{
				"internalType": "uint256",
				"name": "claimedTeam",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "teamEffectiveCnt",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
] as const;


// 代币信息
export const TOKEN_INFO = {
  ALPX: {
    address: CONTRACT_ADDRESSES.ALPX,
    symbol: 'ALPX',
    decimals: 18,
    name: 'ALPX Token',
  },
  ALPS: {
    address: CONTRACT_ADDRESSES.ALPS,
    symbol: 'ALPS',
    decimals: 18,
    name: 'ALPS Token',
  },
  USDT: {
    address: CONTRACT_ADDRESSES.USDT,
    symbol: 'USDT',
    decimals: 18,
    name: 'Tether USD',
  },
} as const

export type TokenSymbol = keyof typeof TOKEN_INFO
