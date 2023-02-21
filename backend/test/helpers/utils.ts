import { readFileSync } from 'fs'
import { join } from 'path'

import { BigNumber, Contract, logger, Signer } from 'ethers'
import { expect } from 'chai'
import hre from 'hardhat'

import '@nomiclabs/hardhat-ethers'

import { DataTypes } from '../../typechain-types/contracts/LearnNGrow'
import { eventsLib, learnNGrow, user } from '../__setup.spec'
import { TransactionReceipt } from '@ethersproject/providers'
import { keccak256, toUtf8Bytes } from 'ethers/lib/utils'

export interface CreateProfileReturningTokenIdStruct {
  sender?: Signer
  vars: DataTypes.CreateProfileDataStruct
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

export async function getTimestamp(): Promise<any> {
  const blockNumber = await hre.ethers.provider.send('eth_blockNumber', [])
  const block = await hre.ethers.provider.send('eth_getBlockByNumber', [
    blockNumber,
    false,
  ])
  return block.timestamp
}

export function matchEvent(
  receipt: TransactionReceipt,
  name: string,
  expectedArgs?: any[],
  eventContract: Contract = eventsLib
) {
  const events = receipt.logs

  if (events == undefined) {
    logger.throwError('No events were emitted')
  }
  // match name from list of events in eventContract, when found, compute the sigHash
  let sigHash: string | undefined

  for (let contractEvent of Object.keys(eventContract.interface.events)) {
    if (
      contractEvent.startsWith(name) &&
      contractEvent.charAt(name.length) == '('
    ) {
      sigHash = keccak256(toUtf8Bytes(contractEvent))
      break
    }
  }
  // Throw if the sigHash was not found
  if (!sigHash) {
    logger.throwError(
      `Event "${name}" not found in provided contract (default: Events libary). \nAre you sure you're using the right contract?`
    )
  }

  // Find the given event in the emitted logs
  let invalidParamsButExists = false
  for (let emittedEvent of events) {
    // If we find one with the correct sighash, check if it is the one we're looking for
    if (emittedEvent.topics[0] == sigHash) {
      const event = eventContract.interface.parseLog(emittedEvent)
      // If there are expected arguments, validate them, otherwise, return here
      if (!expectedArgs) return
      if (expectedArgs.length != event.args.length) {
        logger.throwError(
          `Event "${name}" emitted with correct signature, but expected args are of invalid length`
        )
      }
      invalidParamsButExists = false
      // Iterate through arguments and check them, if there is a mismatch, continue with the loop
      for (let i = 0; i < expectedArgs.length; i++) {
        // Parse empty arrays as empty bytes
        if (
          expectedArgs[i].constructor == Array &&
          expectedArgs[i].length == 0
        ) {
          expectedArgs[i] = '0x'
        }

        // Break out of the expected args loop if there is a mismatch, this will continue the emitted event loop
        if (BigNumber.isBigNumber(event.args[i])) {
          if (!event.args[i].eq(BigNumber.from(expectedArgs[i]))) {
            invalidParamsButExists = true
            break
          }
        } else if (event.args[i] != expectedArgs[i]) {
          invalidParamsButExists = true
          break
        }
      }
      // Return if the for loop did not cause a break, so a match has been found, otherwise proceed with the event loop
      if (!invalidParamsButExists) return
    }
  }

  // Throw if the event args were not expected or the event was not found in the logs
  if (invalidParamsButExists) {
    logger.throwError(`Event "${name}" found in logs but with unexpected args`)
  }
}
