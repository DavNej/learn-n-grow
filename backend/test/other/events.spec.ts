import '@nomiclabs/hardhat-ethers'
import { expect } from 'chai'
import { Signer } from 'ethers'

import type { TransactionReceipt } from '@ethersproject/providers'
import {
  learnNGrow,
  makeSuiteCleanRoom,
  user,
  userAddress,
} from '../__setup.spec'

import {
  FIRST_PROFILE_ID,
  MOCK_PROFILE_HANDLE,
  MOCK_URI,
  MOCK_URI_TWO,
  ZERO_ADDRESS,
} from '../helpers/constants'

import { waitForTx } from '../../utils'
import { getTimestamp, matchEvent } from '../helpers/utils'

makeSuiteCleanRoom('Events', function () {
  let receipt: TransactionReceipt

  context('Generic', function () {
    it('Profile creation should emit the correct events', async function () {
      receipt = await waitForTx(
        learnNGrow.connect(user).createProfile({
          handle: MOCK_PROFILE_HANDLE,
          imageURI: MOCK_URI,
        })
      )

      expect(receipt.logs.length).to.eq(2)

      matchEvent(
        receipt,
        'Transfer',
        [ZERO_ADDRESS, userAddress, FIRST_PROFILE_ID],
        learnNGrow
      )

      matchEvent(receipt, 'ProfileCreated', [
        FIRST_PROFILE_ID,
        userAddress,
        MOCK_PROFILE_HANDLE,
        MOCK_URI,
        await getTimestamp(),
      ])
    })

    it('Posting should emit the correct events', async function () {
      await waitForTx(
        learnNGrow.connect(user).createProfile({
          handle: MOCK_PROFILE_HANDLE,
          imageURI: MOCK_URI,
        })
      )

      receipt = await waitForTx(
        learnNGrow.connect(user).post({
          profileId: FIRST_PROFILE_ID,
          contentURI: MOCK_URI_TWO,
        })
      )

      expect(receipt.logs.length).to.eq(1)

      matchEvent(receipt, 'PostCreated', [
        FIRST_PROFILE_ID,
        1,
        MOCK_URI_TWO,
        await getTimestamp(),
      ])
    })

    it('Commenting should emit the correct events', async function () {
      await waitForTx(
        learnNGrow.connect(user).createProfile({
          handle: MOCK_PROFILE_HANDLE,
          imageURI: MOCK_URI,
        })
      )

      await waitForTx(
        learnNGrow.connect(user).post({
          profileId: FIRST_PROFILE_ID,
          contentURI: MOCK_URI_TWO,
        })
      )

      receipt = await waitForTx(
        learnNGrow.connect(user).comment({
          profileId: FIRST_PROFILE_ID,
          contentURI: MOCK_URI_TWO,
          profileIdPointed: FIRST_PROFILE_ID,
          pubIdPointed: 1,
        })
      )

      expect(receipt.logs.length).to.eq(1)

      matchEvent(receipt, 'CommentCreated', [
        FIRST_PROFILE_ID,
        2,
        MOCK_URI_TWO,
        FIRST_PROFILE_ID,
        1,
        await getTimestamp(),
      ])
    })
  })
})
