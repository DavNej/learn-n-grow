import '@nomiclabs/hardhat-ethers'
import { expect } from 'chai'
import { Signer, Wallet } from 'ethers'
import hre from 'hardhat'

import type { Events, LearnNGrow } from '../typechain-types'

import { Events__factory } from '../typechain-types/factories/contracts/libraries/Events__factory'
import { LearnNGrow__factory } from '../typechain-types/factories/contracts'

import {
  FAKE_PRIVATEKEY,
  LEARN_N_GROW_NFT_NAME,
  LEARN_N_GROW_NFT_SYMBOL,
} from './helpers/constants'
import { revertToSnapshot, takeSnapshot } from './helpers/utils'

// Accounts
export let accounts: Signer[]
export let deployer: Signer
export let user: Signer
export let userTwo: Signer
export let userThree: Signer

// Accounts addresses
export let deployerAddress: string
export let userAddress: string
export let userTwoAddress: string
export let userThreeAddress: string

// Accounts addresses
export let testWallet: Wallet
export let learnNGrow: LearnNGrow
export let eventsLib: Events

export function makeSuiteCleanRoom(name: string, tests: () => void) {
  describe(name, () => {
    beforeEach(async function () {
      await takeSnapshot()
    })
    tests()
    afterEach(async function () {
      await revertToSnapshot()
    })
  })
}

before(async function () {
  testWallet = new hre.ethers.Wallet(FAKE_PRIVATEKEY).connect(
    hre.ethers.provider
  )

  accounts = await hre.ethers.getSigners()

  deployer = accounts[0]
  user = accounts[1]
  userTwo = accounts[2]
  userThree = accounts[4]

  deployerAddress = await deployer.getAddress()
  userAddress = await user.getAddress()
  userTwoAddress = await userTwo.getAddress()
  userThreeAddress = await userThree.getAddress()

  // Deployment
  learnNGrow = await new LearnNGrow__factory(deployer).deploy(
    LEARN_N_GROW_NFT_NAME,
    LEARN_N_GROW_NFT_SYMBOL
  )
  // Event library deployment is only needed for testing and is not reproduced in the live environment
  eventsLib = await new Events__factory(deployer).deploy()

  expect(learnNGrow).to.not.be.undefined
})
