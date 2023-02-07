import { HardhatUserConfig } from 'hardhat/config'
import type { NetworkUserConfig } from 'hardhat/types'

import '@nomicfoundation/hardhat-toolbox'
import '@nomiclabs/hardhat-etherscan'

import 'dotenv/config'
import 'hardhat-deploy'
import 'hardhat-gas-reporter'
import 'solidity-coverage'

const PRIVATE_KEY = process.env.PRIVATE_KEY || ''
const ALCHEMY_GOERLI = process.env.ALCHEMY_GOERLI || ''
const ETERSCAN_API_KEY = process.env.ETERSCAN_API_KEY || ''

const networks: Record<string, NetworkUserConfig> = {
  localhost: {
    url: 'http://127.0.0.1:8545',
    chainId: 31337,
  },
  goerli: {
    url: ALCHEMY_GOERLI,
    chainId: 5,
    accounts: [`0x${PRIVATE_KEY}`],
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
      1: 0,
    },
  },
  gasReporter: {
    enabled: true,
  },
  solidity: {
    compilers: [
      {
        version: '0.8.17',
      },
    ],
  },
}

export default config
