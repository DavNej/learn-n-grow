import '@nomiclabs/hardhat-ethers'
import { expect } from 'chai'

import { learnNGrow, makeSuiteCleanRoom } from '../__setup.spec'

import {
  FIRST_PROFILE_ID,
  MOCK_PROFILE_HANDLE,
  MOCK_URI,
  MOCK_URI_TWO,
  MOCK_URI_THREE,
} from '../helpers/constants'

makeSuiteCleanRoom('Publications: Getters', function () {
  context('Generic', function () {
    beforeEach(async function () {
      await expect(
        learnNGrow.createProfile({
          handle: MOCK_PROFILE_HANDLE,
          imageURI: MOCK_URI,
        })
      ).to.not.be.reverted
    })
    it('Profile publication count getter should return zero, then the correct amount after some publications', async function () {
      expect(await learnNGrow.getPubCount(FIRST_PROFILE_ID)).to.eq(0)

      const expectedCount = 5

      for (let i = 0; i < expectedCount; i++) {
        await expect(
          learnNGrow.post({
            profileId: FIRST_PROFILE_ID,
            contentURI: MOCK_URI_TWO,
          })
        ).to.not.be.reverted
      }
      expect(await learnNGrow.getPubCount(FIRST_PROFILE_ID)).to.eq(
        expectedCount
      )
    })

    it('Publication pointer getter should return an empty pointer for posts', async function () {
      await expect(
        learnNGrow.post({
          profileId: FIRST_PROFILE_ID,
          contentURI: MOCK_URI_TWO,
        })
      ).to.not.be.reverted

      const pointer = await learnNGrow.getPubPointer(FIRST_PROFILE_ID, 1)

      expect(pointer[0]).to.eq(0)
      expect(pointer[1]).to.eq(0)
    })

    it('Publication pointer getter should return the correct pointer for comments', async function () {
      await expect(
        learnNGrow.post({
          profileId: FIRST_PROFILE_ID,
          contentURI: MOCK_URI_TWO,
        })
      ).to.not.be.reverted

      await expect(
        learnNGrow.comment({
          profileId: FIRST_PROFILE_ID,
          contentURI: MOCK_URI_TWO,
          profileIdPointed: FIRST_PROFILE_ID,
          pubIdPointed: 1,
        })
      ).to.not.be.reverted

      const pointer = await learnNGrow.getPubPointer(FIRST_PROFILE_ID, 2)
      expect(pointer[0]).to.eq(FIRST_PROFILE_ID)
      expect(pointer[1]).to.eq(1)
    })

    it('Publication content URI getter should return the correct URI for posts', async function () {
      await expect(
        learnNGrow.post({
          profileId: FIRST_PROFILE_ID,
          contentURI: MOCK_URI_TWO,
        })
      ).to.not.be.reverted

      expect(await learnNGrow.getContentURI(FIRST_PROFILE_ID, 1)).to.eq(
        MOCK_URI_TWO
      )
    })

    it('Publication content URI getter should return the correct URI for comments', async function () {
      await expect(
        learnNGrow.post({
          profileId: FIRST_PROFILE_ID,
          contentURI: MOCK_URI_THREE,
        })
      ).to.not.be.reverted

      await expect(
        learnNGrow.comment({
          profileId: FIRST_PROFILE_ID,
          contentURI: MOCK_URI_THREE,
          profileIdPointed: FIRST_PROFILE_ID,
          pubIdPointed: 1,
        })
      ).to.not.be.reverted

      expect(await learnNGrow.getContentURI(FIRST_PROFILE_ID, 2)).to.eq(
        MOCK_URI_THREE
      )
    })

    it('Publication type getter should return the correct publication type for all publication types, or nonexistent', async function () {
      await expect(
        learnNGrow.post({
          profileId: FIRST_PROFILE_ID,
          contentURI: MOCK_URI_TWO,
        })
      ).to.not.be.reverted

      await expect(
        learnNGrow.comment({
          profileId: FIRST_PROFILE_ID,
          contentURI: MOCK_URI_THREE,
          profileIdPointed: FIRST_PROFILE_ID,
          pubIdPointed: 1,
        })
      ).to.not.be.reverted

      expect(await learnNGrow.getPubType(FIRST_PROFILE_ID, 1)).to.eq(0)
      expect(await learnNGrow.getPubType(FIRST_PROFILE_ID, 2)).to.eq(1)
      expect(await learnNGrow.getPubType(FIRST_PROFILE_ID, 3)).to.eq(2)
    })
  })
})
