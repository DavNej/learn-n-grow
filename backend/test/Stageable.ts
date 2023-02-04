import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { deployStorageFixture } from './utils'

import { assert, expect } from 'chai'

describe('Storage', () => {
  describe('Deployment', () => {
    it('Should set the right owner', async function () {
      const { storage, owner } = await loadFixture(deployStorageFixture)
      expect(await storage.owner()).to.equal(owner.address)
    })
  })
})
