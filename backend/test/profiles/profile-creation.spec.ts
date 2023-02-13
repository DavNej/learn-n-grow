import '@nomiclabs/hardhat-ethers'
import { expect } from 'chai'
import { BigNumber } from 'ethers'

import {
  learnNGrow,
  makeSuiteCleanRoom,
  userAddress,
  userTwo,
  userTwoAddress,
} from '../__setup.spec'

import {
  FIRST_PROFILE_ID,
  MAX_PROFILE_IMAGE_URI_LENGTH,
  MOCK_PROFILE_HANDLE,
  MOCK_URI,
} from '../helpers/constants'
import { ERRORS } from '../helpers/errors'
import { createProfileReturningTokenId } from '../helpers/utils'

makeSuiteCleanRoom('Profile: Creation', function () {
  context('Generic', function () {
    context('Negatives', function () {
      it('User should fail to create a profile with a handle longer than 31 bytes', async function () {
        const val = '11111111111111111111111111111111'
        expect(val.length).to.eq(32)

        await expect(
          learnNGrow.createProfile({
            handle: val,
            imageURI: MOCK_URI,
          })
        ).to.be.revertedWithCustomError(
          learnNGrow,
          ERRORS.INVALID_HANDLE_LENGTH
        )
      })

      it('User should fail to create a profile with an empty handle (0 length bytes)', async function () {
        await expect(
          learnNGrow.createProfile({
            handle: '',
            imageURI: MOCK_URI,
          })
        ).to.be.revertedWithCustomError(
          learnNGrow,
          ERRORS.INVALID_HANDLE_LENGTH
        )
      })

      it('User should fail to create a profile with a handle with a capital letter', async function () {
        await expect(
          learnNGrow.createProfile({
            handle: 'Egg',
            imageURI: MOCK_URI,
          })
        ).to.be.revertedWithCustomError(
          learnNGrow,
          ERRORS.HANDLE_CONTAINS_INVALID_CHARACTERS
        )
      })

      it('User should fail to create a profile with a handle with an invalid character', async function () {
        await expect(
          learnNGrow.createProfile({
            handle: 'egg?',
            imageURI: MOCK_URI,
          })
        ).to.be.revertedWithCustomError(
          learnNGrow,
          ERRORS.HANDLE_CONTAINS_INVALID_CHARACTERS
        )
      })

      it('User should fail to create a profile with invalid image URI length', async function () {
        const profileURITooLong = MOCK_URI.repeat(500)
        expect(profileURITooLong.length).to.be.greaterThan(
          MAX_PROFILE_IMAGE_URI_LENGTH
        )

        await expect(
          learnNGrow.createProfile({
            handle: MOCK_PROFILE_HANDLE,
            imageURI: profileURITooLong,
          })
        ).to.be.revertedWithCustomError(
          learnNGrow,
          ERRORS.INVALID_IMAGE_URI_LENGTH
        )
      })
    })

    context('Scenarios', function () {
      it('User should be able to create a profile with a handle, receive an NFT and the handle should resolve to the NFT ID, userTwo should do the same', async function () {
        let owner: string
        let totalSupply: BigNumber
        let profileId: BigNumber

        expect(
          await createProfileReturningTokenId({
            vars: {
              handle: MOCK_PROFILE_HANDLE,
              imageURI: MOCK_URI,
            },
          })
        ).to.eq(FIRST_PROFILE_ID)

        owner = await learnNGrow.ownerOf(FIRST_PROFILE_ID)
        totalSupply = await learnNGrow.totalSupply()
        profileId = await learnNGrow.getProfileIdByHandle(MOCK_PROFILE_HANDLE)

        expect(owner).to.eq(userAddress)
        expect(totalSupply).to.eq(FIRST_PROFILE_ID)
        expect(profileId).to.eq(FIRST_PROFILE_ID)

        const secondProfileId = FIRST_PROFILE_ID + 1
        const secondProfileHandle = '2nd_profile'
        expect(
          await createProfileReturningTokenId({
            sender: userTwo,
            vars: {
              handle: secondProfileHandle,
              imageURI: MOCK_URI,
            },
          })
        ).to.eq(secondProfileId)

        owner = await learnNGrow.ownerOf(secondProfileId)
        totalSupply = await learnNGrow.totalSupply()
        profileId = await learnNGrow.getProfileIdByHandle(secondProfileHandle)

        expect(owner).to.eq(userTwoAddress)
        expect(totalSupply).to.eq(secondProfileId)
        expect(profileId).to.eq(secondProfileId)
      })

      it('Should return the expected token IDs when creating profiles', async function () {
        expect(
          await createProfileReturningTokenId({
            vars: {
              handle: 'token.id_1',
              imageURI: MOCK_URI,
            },
          })
        ).to.eq(FIRST_PROFILE_ID)

        const secondProfileId = FIRST_PROFILE_ID + 1
        expect(
          await createProfileReturningTokenId({
            sender: userTwo,
            vars: {
              handle: 'token.id_2',
              imageURI: MOCK_URI,
            },
          })
        ).to.eq(secondProfileId)

        const thirdProfileId = secondProfileId + 1
        expect(
          await createProfileReturningTokenId({
            vars: {
              handle: 'token.id_3',
              imageURI: MOCK_URI,
            },
          })
        ).to.eq(thirdProfileId)
      })

      it('User should be able to create a profile with a handle including "-" and "_" characters', async function () {
        await expect(
          learnNGrow.createProfile({
            handle: 'morse--__-_--code',
            imageURI: MOCK_URI,
          })
        ).to.not.be.reverted
      })

      it('User should be able to create a profile with a handle 16 bytes long, then fail to create with the same handle, and create again with a different handle', async function () {
        await expect(
          learnNGrow.createProfile({
            handle: '123456789012345',
            imageURI: MOCK_URI,
          })
        ).to.not.be.reverted
        await expect(
          learnNGrow.createProfile({
            handle: '123456789012345',
            imageURI: MOCK_URI,
          })
        ).to.be.revertedWithCustomError(learnNGrow, ERRORS.PROFILE_HANDLE_TAKEN)
        await expect(
          learnNGrow.createProfile({
            handle: 'abcdefghijklmno',
            imageURI: MOCK_URI,
          })
        ).to.not.be.reverted
      })
    })
  })
})
