import { assert, expect } from 'chai'

import {
  deployLNGProfileFixture,
  profile_1,
  baseURI,
  mintProfile,
} from './utils'

describe('LNGProfile', () => {
  describe('Deployment', () => {
    it('Should deploy contract', async function () {
      const { contract } = await deployLNGProfileFixture()
      assert.exists(await contract.deployed())
      assert.equal(await contract.baseURI(), baseURI)
      assert.equal(await contract.name(), 'LNGProfile')
      assert.equal(await contract.symbol(), 'LNGP')
    })
  })

  describe('LNGProfile', () => {
    describe('mintProfile', () => {
      it('Should mint a new profile NFT', async function () {
        const { contract, user_1 } = await deployLNGProfileFixture()

        assert.equal(await contract.balanceOf(user_1.address), 0)

        const tx = await mintProfile(contract, user_1)

        assert.equal(await contract.balanceOf(user_1.address), 1)

        expect(tx).to.emit(contract, 'ProfileMinted').withArgs(user_1.address)
      })

      it('Should NOT mint a profile NFT if it was already minted', async function () {
        const { contract, user_1 } = await deployLNGProfileFixture()

        assert.equal(await contract.balanceOf(user_1.address), 0)

        await mintProfile(contract, user_1)

        assert.equal(await contract.balanceOf(user_1.address), 1)

        await expect(mintProfile(contract, user_1))
          .to.be.revertedWithCustomError(contract, 'LNGProfile__AlreadyMinted')
          .withArgs(user_1.address)
      })
    })

    describe('getProfile', () => {
      it('Should return empty profile', async function () {
        const { contract, user_1 } = await deployLNGProfileFixture()

        const profile = await contract.getProfile(user_1.address)

        assert.equal(profile.tokenId, 0)
        assert.equal(profile.name, '')
        assert.equal(profile.description, '')
        assert.equal(profile.avatar, '')
      })

      it('Should return user profile', async function () {
        const { contract, user_1 } = await deployLNGProfileFixture()

        await mintProfile(contract, user_1)

        const profile = await contract.getProfile(user_1.address)

        assert.equal(profile.tokenId, 1)
        assert.equal(profile.name, profile_1.name)
        assert.equal(profile.description, profile_1.description)
        assert.equal(profile.avatar, profile_1.avatar)
      })
    })

    it('Should NOT receive funds', async function () {
      const { contract, user_1 } = await deployLNGProfileFixture()

      await expect(
        user_1.sendTransaction({ to: contract.address, value: 1000 })
      ).to.be.revertedWith('Contract does not receive funds')
    })
  })
})
