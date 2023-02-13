import '@nomiclabs/hardhat-ethers'
import { expect } from 'chai'
import {
  getDecodedSvgImage,
  getMetadataFromBase64TokenUri,
  loadTestResourceAsUtf8String,
} from '../helpers/utils'
import {
  FIRST_PROFILE_ID,
  MOCK_PROFILE_HANDLE,
  MOCK_URI,
} from '../helpers/constants'
import {
  learnNGrow,
  makeSuiteCleanRoom,
  user,
  userAddress,
} from '../__setup.spec'

makeSuiteCleanRoom('Profile: Getters', function () {
  context('Generic', function () {
    beforeEach(async function () {
      await expect(
        learnNGrow.connect(user).createProfile({
          handle: MOCK_PROFILE_HANDLE,
          imageURI: MOCK_URI,
        })
      ).to.not.be.reverted
    })

    it('Profile handle getter should return the correct handle', async function () {
      expect(await learnNGrow.getHandle(FIRST_PROFILE_ID)).to.eq(
        MOCK_PROFILE_HANDLE
      )
    })

    it('Profile getter by address should return accurate profile id', async function () {
      expect(await learnNGrow.profile(userAddress)).to.eq(FIRST_PROFILE_ID)
    })

    it('Profile getter by id should return accurate profile parameters', async function () {
      const fetchedProfile = await learnNGrow.getProfile(FIRST_PROFILE_ID)
      expect(fetchedProfile.imageURI).to.eq(MOCK_URI)
      expect(fetchedProfile.handle).to.eq(MOCK_PROFILE_HANDLE)
    })

    it('Profile tokenURI should return the accurate URI', async function () {
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
      const expectedSvg = loadTestResourceAsUtf8String('mock-profile.svg')
      expect(actualSvg).to.eq(expectedSvg)
    })

    it.skip('User should burn profile owned by user', async function () {
      await expect(learnNGrow.burn(FIRST_PROFILE_ID)).to.not.be.reverted
    })
  })
})
