const abi = [
    {
      constant: true,
      inputs: [],
      name: 'name',
      outputs: [
          {
              name: '',
              type: 'string'
          }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
  },
  {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [
          {
              name: '',
              type: 'uint8'
          }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
        {
            name: '',
            type: 'string'
        }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

const availableTokens = [
  {
    symbol: 'CAKE',
    name: 'PancakeSwap Token',
    address: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82'
  }, 
  {
    symbol: 'MONI',
    name: 'Monsta Infinite Token',
    address: '0x9573c88ae3e37508f87649f87c4dd5373c9f31e0'
  }, 
  {
    symbol: 'WANA',
    name: 'Wanaka Farm',
    address: '0x339c72829ab7dd45c3c52f965e7abe358dd8761e'
  }, 
  {
    symbol: 'PVU',
    name: 'Plant vs Undead Token',
    address: '0x31471e0791fcdbe82fbf4c44943255e923f1b794'
  },
]


const coingecko_base_url = 'https://api.coingecko.com/api/v3'

export { abi, availableTokens, coingecko_base_url };