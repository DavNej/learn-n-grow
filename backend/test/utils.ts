import type { Contract, Signer } from 'ethers'
import { ethers } from 'hardhat'

// Constants
export const baseURI = 'baseURI'

export const profile_1 = {
  name: 'Alice',
  description: 'I am Alice',
  avatar: 'avatar',
  tokenURI: 'tokenURI',
}

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
        profile_1.tokenURI,
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
