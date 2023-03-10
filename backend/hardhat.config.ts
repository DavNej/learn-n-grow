import { HardhatUserConfig } from 'hardhat/config'
import type { NetworkUserConfig } from 'hardhat/types'

import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
import '@nomicfoundation/hardhat-toolbox'
import '@typechain/hardhat'

import 'dotenv/config'
import 'hardhat-deploy'
import 'hardhat-gas-reporter'
import 'solidity-coverage'

import glob from 'glob'
import path from 'path'

const ALCHEMY_GOERLI = process.env.ALCHEMY_GOERLI || ''
const ETERSCAN_API_KEY = process.env.ETERSCAN_API_KEY || ''

if (!process.env.SKIP_TASKS_LOAD) {
  glob.sync('./tasks/**/*.ts').forEach(function (file) {
    require(path.resolve(file))
  })
}

const goerliAccounts = [
  process.env.PRIVATE_KEY_0 || '',
  process.env.PRIVATE_KEY_1 || '',
  process.env.PRIVATE_KEY_2 || '',
  process.env.PRIVATE_KEY_3 || '',
  process.env.PRIVATE_KEY_4 || '',
]

const networks: Record<string, NetworkUserConfig> = {
  local: {
    url: 'http://127.0.0.1:8545',
    chainId: 31337,
  },
  goerli: {
    url: ALCHEMY_GOERLI,
    chainId: 5,
    accounts: goerliAccounts,
  },
}

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks,
  etherscan: {
    apiKey: {
      goerli: ETERSCAN_API_KEY,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  gasReporter: {
    enabled: true,
  },
  solidity: {
    compilers: [
      {
        version: '0.8.17',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
}

export default config
