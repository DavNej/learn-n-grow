import '@nomiclabs/hardhat-ethers'
import { expect } from 'chai'

import { learnNGrow, makeSuiteCleanRoom, user, userTwo } from '../__setup.spec'

import {
  FIRST_PROFILE_ID,
  MOCK_PROFILE_HANDLE,
  MOCK_URI,
  MOCK_URI_TWO,
  MOCK_URI_THREE,
} from '../helpers/constants'
import { ERRORS } from '../helpers/errors'

const SECOND_PROFILE_ID = 2

makeSuiteCleanRoom('Publications: Comments', function () {
  context('Generic', function () {
    beforeEach(async function () {
      await expect(
        learnNGrow.connect(user).createProfile({
          handle: MOCK_PROFILE_HANDLE,
          imageURI: MOCK_URI,
        })
      ).to.not.be.reverted

      await expect(
        learnNGrow.connect(user).post({
          profileId: FIRST_PROFILE_ID,
          contentURI: MOCK_URI,
        })
      ).to.not.be.reverted

      await expect(
        learnNGrow.connect(userTwo).createProfile({
          handle: 'user-two',
          imageURI: MOCK_URI_TWO,
        })
      ).to.not.be.reverted
    })

    context('Negatives', function () {
      it('UserTwo should fail to publish a comment to a profile owned by User', async function () {
        await expect(
          learnNGrow.connect(userTwo).comment({
            profileId: FIRST_PROFILE_ID,
            contentURI: MOCK_URI,
            profileIdPointed: FIRST_PROFILE_ID,
            pubIdPointed: 1,
          })
        ).to.be.revertedWithCustomError(learnNGrow, ERRORS.NOT_PROFILE_OWNER)
      })

      it('User should fail to comment on a publication that does not exist', async function () {
        await expect(
          learnNGrow.connect(user).comment({
            profileId: FIRST_PROFILE_ID,
            contentURI: MOCK_URI,
            profileIdPointed: FIRST_PROFILE_ID,
            pubIdPointed: 3,
          })
        ).to.be.revertedWithCustomError(
          learnNGrow,
          ERRORS.PUBLICATION_DOES_NOT_EXIST
        )
      })

      it('User should fail to comment on the same comment they are creating (pubId = 2, commentCeption)', async function () {
        await expect(
          learnNGrow.connect(user).comment({
            profileId: FIRST_PROFILE_ID,
            contentURI: MOCK_URI,
            profileIdPointed: FIRST_PROFILE_ID,
            pubIdPointed: 2,
          })
        ).to.be.revertedWithCustomError(
          learnNGrow,
          ERRORS.CANNOT_COMMENT_ON_SELF
        )
      })
    })

    context('Scenarios', function () {
      it('Should return the expected token ID when commenting publications', async function () {
        const vars = {
          profileId: SECOND_PROFILE_ID,
          contentURI: MOCK_URI_TWO,
          profileIdPointed: FIRST_PROFILE_ID,
          pubIdPointed: 1,
        }

        expect(
          await learnNGrow.connect(userTwo).callStatic.comment(vars)
        ).to.eq(1)
        await expect(
          learnNGrow.connect(userTwo).comment(vars)
        ).to.not.be.reverted
        expect(
          await learnNGrow.connect(userTwo).callStatic.comment(vars)
        ).to.eq(2)
      })

      it('Publication getter should return accurate pub data', async function () {
        const vars = {
          profileId: SECOND_PROFILE_ID,
          contentURI: MOCK_URI_TWO,
          profileIdPointed: FIRST_PROFILE_ID,
          pubIdPointed: 1,
        }

        await expect(
          learnNGrow.connect(userTwo).comment(vars)
        ).to.not.be.reverted

        const post = await learnNGrow.getPub(FIRST_PROFILE_ID, 1)
        console.log({ post })
        expect(post.profileIdPointed).to.eq(0)
        expect(post.pubIdPointed).to.eq(0)
        expect(post.contentURI).to.eq(MOCK_URI)

        const pub = await learnNGrow.getPub(SECOND_PROFILE_ID, 1)
        console.log({ pub })
        expect(pub.profileIdPointed).to.eq(FIRST_PROFILE_ID)
        expect(pub.pubIdPointed).to.eq(1)
        expect(pub.contentURI).to.eq(MOCK_URI_TWO)
      })
    })
  })
})
