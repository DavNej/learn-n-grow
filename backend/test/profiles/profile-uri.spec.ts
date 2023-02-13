import '@nomiclabs/hardhat-ethers'
import { expect } from 'chai'
import { ERRORS } from '../helpers/errors'
import {
  getDecodedSvgImage,
  getMetadataFromBase64TokenUri,
  loadTestResourceAsUtf8String,
} from '../helpers/utils'
import {
  FIRST_PROFILE_ID,
  MAX_PROFILE_IMAGE_URI_LENGTH,
  MOCK_PROFILE_HANDLE,
  MOCK_URI,
  MOCK_URI_TWO,
} from '../helpers/constants'
import {
  learnNGrow,
  makeSuiteCleanRoom,
  user,
  userAddress,
  userTwo,
  userTwoAddress,
} from '../__setup.spec'

makeSuiteCleanRoom('Profile: URI Functionality', function () {
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
      it('UserTwo should fail to set the profile URI on profile owned by user 1', async function () {
        await expect(
          learnNGrow
            .connect(userTwo)
            .setProfileImageURI(FIRST_PROFILE_ID, MOCK_URI_TWO)
        ).to.be.revertedWithCustomError(learnNGrow, ERRORS.NOT_PROFILE_OWNER)
      })

      it('User should fail to a the profile URI that is too long', async function () {
        const profileURITooLong = MOCK_URI_TWO.repeat(500)
        expect(profileURITooLong.length).to.be.greaterThan(
          MAX_PROFILE_IMAGE_URI_LENGTH
        )
        await expect(
          learnNGrow
            .connect(user)
            .setProfileImageURI(FIRST_PROFILE_ID, profileURITooLong)
        ).to.be.revertedWithCustomError(
          learnNGrow,
          ERRORS.INVALID_IMAGE_URI_LENGTH
        )
      })
    })

    context('Scenarios', function () {
      it('User should have a custom picture tokenURI after setting the profile imageURI', async function () {
        await expect(
          learnNGrow
            .connect(user)
            .setProfileImageURI(FIRST_PROFILE_ID, MOCK_URI_TWO)
        ).to.not.be.reverted

        const tokenUri = await learnNGrow.tokenURI(FIRST_PROFILE_ID)
        const metadata = await getMetadataFromBase64TokenUri(tokenUri)

        expect(metadata.name).to.eq(`@${MOCK_PROFILE_HANDLE}`)
        expect(metadata.description).to.eq(
          `@${MOCK_PROFILE_HANDLE} - Learn N Grow profile`
        )
        const expectedAttributes = [
          { trait_type: 'id', value: `#${FIRST_PROFILE_ID.toString()}` },
          { trait_type: 'owner', value: userAddress.toLowerCase() },
          { trait_type: 'handle', value: `@${MOCK_PROFILE_HANDLE}` },
        ]
        expect(metadata.attributes).to.eql(expectedAttributes)

        const actualSvg = await getDecodedSvgImage(metadata)
        const expectedSvg = loadTestResourceAsUtf8String('mock-profile-two.svg')

        expect(actualSvg).to.eq(expectedSvg)
      })

      it('Should revert when imageURI contains double-quotes', async function () {
        const imageUri =
          'https://ipfs.io/ipfs/QmbWqxBEKC3P8tqsKc98xmWNzrztRLMiMPL8wBuTGsMnR" <rect x="10" y="10" fill="red'

        await expect(
          learnNGrow
            .connect(user)
            .setProfileImageURI(FIRST_PROFILE_ID, imageUri)
        ).to.be.revertedWithCustomError(learnNGrow, ERRORS.UNSAFE_URI)
      })

      it('Should revert when no imageURI set', async function () {
        await expect(
          learnNGrow.connect(user).setProfileImageURI(FIRST_PROFILE_ID, '')
        ).to.be.revertedWithCustomError(learnNGrow, ERRORS.EMPTY_IMAGE_URI)
      })

      it.skip('Default image should be used when no imageURI set', async function () {})
      it.skip('Default image should be used when imageURI contains double-quotes', async function () {})

      it('Should return the correct tokenURI after transfer', async function () {
        const tokenUriBeforeTransfer = await learnNGrow.tokenURI(
          FIRST_PROFILE_ID
        )
        const metadataBeforeTransfer = await getMetadataFromBase64TokenUri(
          tokenUriBeforeTransfer
        )
        expect(metadataBeforeTransfer.name).to.eq(`@${MOCK_PROFILE_HANDLE}`)
        expect(metadataBeforeTransfer.description).to.eq(
          `@${MOCK_PROFILE_HANDLE} - Learn N Grow profile`
        )
        const expectedAttributesBeforeTransfer = [
          { trait_type: 'id', value: `#${FIRST_PROFILE_ID.toString()}` },
          { trait_type: 'owner', value: userAddress.toLowerCase() },
          { trait_type: 'handle', value: `@${MOCK_PROFILE_HANDLE}` },
        ]
        expect(metadataBeforeTransfer.attributes).to.eql(
          expectedAttributesBeforeTransfer
        )
        const svgBeforeTransfer = await getDecodedSvgImage(
          metadataBeforeTransfer
        )
        const expectedSvg = loadTestResourceAsUtf8String('mock-profile.svg')

        expect(svgBeforeTransfer).to.eq(expectedSvg)

        await expect(
          learnNGrow
            .connect(user) // either connect as the token owner or ERC721.approve the connected address
            .transferFrom(userAddress, userTwoAddress, FIRST_PROFILE_ID)
        ).to.not.be.reverted

        const tokenUriAfterTransfer = await learnNGrow.tokenURI(
          FIRST_PROFILE_ID
        )
        const metadataAfterTransfer = await getMetadataFromBase64TokenUri(
          tokenUriAfterTransfer
        )
        expect(metadataAfterTransfer.name).to.eq(`@${MOCK_PROFILE_HANDLE}`)
        expect(metadataAfterTransfer.description).to.eq(
          `@${MOCK_PROFILE_HANDLE} - Learn N Grow profile`
        )
        const expectedAttributesAfterTransfer = [
          { trait_type: 'id', value: `#${FIRST_PROFILE_ID.toString()}` },
          { trait_type: 'owner', value: userTwoAddress.toLowerCase() },
          { trait_type: 'handle', value: `@${MOCK_PROFILE_HANDLE}` },
        ]
        expect(metadataAfterTransfer.attributes).to.eql(
          expectedAttributesAfterTransfer
        )

        const svgAfterTransfer = await getDecodedSvgImage(metadataAfterTransfer)

        expect(svgAfterTransfer).to.eq(expectedSvg)
      })
    })
  })
})
