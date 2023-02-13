import '@nomiclabs/hardhat-ethers'
import { expect } from 'chai'

import { learnNGrow, makeSuiteCleanRoom, user, userTwo } from '../__setup.spec'

import {
  FIRST_PROFILE_ID,
  MOCK_PROFILE_HANDLE,
  MOCK_URI,
} from '../helpers/constants'
import { ERRORS } from '../helpers/errors'

makeSuiteCleanRoom('Publications: Posts', function () {
  context('Generic', function () {
    beforeEach(async function () {
      await expect(
        learnNGrow.connect(user).createProfile({
          handle: MOCK_PROFILE_HANDLE,
          imageURI: MOCK_URI,
        })
      ).to.not.be.reverted
    })

    context('Negatives', function () {
      it('UserTwo should fail to post to a profile owned by User', async function () {
        await expect(
          learnNGrow.connect(userTwo).post({
            profileId: FIRST_PROFILE_ID,
            contentURI: MOCK_URI,
          })
        ).to.be.revertedWithCustomError(learnNGrow, ERRORS.NOT_PROFILE_OWNER)
      })
    })

    context('Scenarios', function () {
      it('Should return the expected token IDs when creating a post', async function () {
        const vars = {
          profileId: FIRST_PROFILE_ID,
          contentURI: MOCK_URI,
        }

        expect(await learnNGrow.connect(user).callStatic.post(vars)).to.eq(1)
        await expect(learnNGrow.connect(user).post(vars)).to.not.be.reverted
        expect(await learnNGrow.connect(user).callStatic.post(vars)).to.eq(2)
      })
    })
  })
})
