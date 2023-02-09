import '@nomiclabs/hardhat-ethers'
import { BigNumber, Signer } from 'ethers'
import { expect } from 'chai'
import hre from 'hardhat'

import { DataTypes } from '../../typechain-types/contracts/LearnNGrow'
import { learnNGrow, user } from '../__setup.spec'

let snapshotId: string = '0x1'

export async function takeSnapshot() {
  snapshotId = await hre.ethers.provider.send('evm_snapshot', [])
}

export async function revertToSnapshot() {
  await hre.ethers.provider.send('evm_revert', [snapshotId])
}

export interface CreateProfileReturningTokenIdStruct {
  sender?: Signer
  vars: DataTypes.ProfileStruct
}

export async function createProfileReturningTokenId({
  sender = user,
  vars,
}: CreateProfileReturningTokenIdStruct): Promise<BigNumber> {
  const tokenId = await learnNGrow
    .connect(sender)
    .callStatic.createProfile(vars)

  await expect(learnNGrow.connect(sender).createProfile(vars)).to.not.be
    .reverted

  return tokenId
}
