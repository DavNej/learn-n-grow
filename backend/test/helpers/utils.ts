import { readFileSync } from 'fs'
import { join } from 'path'

import { BigNumber, logger, Signer } from 'ethers'
import { expect } from 'chai'
import hre from 'hardhat'

import '@nomiclabs/hardhat-ethers'

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

export interface TokenUriMetadataAttribute {
  trait_type: string
  value: string
}

export interface ProfileTokenUriMetadata {
  name: string
  description: string
  image: string
  attributes: TokenUriMetadataAttribute[]
}

export async function getMetadataFromBase64TokenUri(
  tokenUri: string
): Promise<ProfileTokenUriMetadata> {
  const splittedTokenUri = tokenUri.split('data:application/json;base64,')
  if (splittedTokenUri.length != 2) {
    logger.throwError('Wrong or unrecognized token URI format')
  } else {
    const jsonMetadataBase64String = splittedTokenUri[1]
    const jsonMetadataBytes = hre.ethers.utils.base64.decode(
      jsonMetadataBase64String
    )
    const jsonMetadataString = hre.ethers.utils.toUtf8String(jsonMetadataBytes)
    return JSON.parse(jsonMetadataString)
  }
}

export async function getDecodedSvgImage(
  tokenUriMetadata: ProfileTokenUriMetadata
) {
  const splittedImage = tokenUriMetadata.image.split(
    'data:image/svg+xml;base64,'
  )
  if (splittedImage.length != 2) {
    logger.throwError('Wrong or unrecognized token URI format')
  } else {
    return hre.ethers.utils.toUtf8String(
      hre.ethers.utils.base64.decode(splittedImage[1])
    )
  }
}
export function loadTestResourceAsUtf8String(relativePathToResouceDir: string) {
  return readFileSync(
    join('test', 'resources', relativePathToResouceDir),
    'utf8'
  )
}
