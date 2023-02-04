import { ethers } from 'hardhat'

// Fixtures
export async function deploySimpleStorageFixture() {
  const [owner, otherAccount] = await ethers.getSigners()

  const SimpleStorage = await ethers.getContractFactory('SimpleStorage')
  const simpleStorage = await SimpleStorage.deploy()

  return { simpleStorage, owner, otherAccount }
}

// Constansts
