import type { Contract, Signer } from 'ethers'
import { ethers } from 'hardhat'
import { baseURI } from '../utils/constants'

// Constants

export const profile_1 = {
  name: 'Alice',
  description: 'I am Alice',
  image: 'avatar.png',
  tokenId: 1,
}

// {
//   "name": "Dave Starbelly",
//   "description": "Friendly OpenSea Creature that enjoys long swims in the ocean.",
//   "image": "https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png",
//   "external_url": "https://openseacreatures.io/3",
//   "attributes": [ ... ]
// }

// Helpers
export async function mintProfile(
  contract: Contract,
  user: Signer,
  ...args: string[]
) {
  const params = Boolean(args.length)
    ? args
    : [
        profile_1.name,
        profile_1.description,
        profile_1.avatar,
        profile_1.tokenId,
      ]

  const tx = await contract.connect(user).mintProfile(...params)

  await tx.wait(1)

  return tx
}

// Fixtures
export async function deployLNGProfileFixture() {
  const [owner, user_1, user_2, user_3] = await ethers.getSigners()

  const LNGProfile = await ethers.getContractFactory('LNGProfile')
  const contract = await LNGProfile.deploy(baseURI)

  return { contract, owner, user_1, user_2, user_3 }
}
