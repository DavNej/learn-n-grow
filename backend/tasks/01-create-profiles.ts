import '@nomicfoundation/hardhat-toolbox'
import { ContractTransaction } from 'ethers'

import { task } from 'hardhat/config'
import { LearnNGrow__factory } from '../typechain-types/index'

export async function waitForTx(tx: Promise<ContractTransaction>) {
  await (await tx).wait()
}

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

task('create-profiles', 'Populate profiles').setAction(async (_, hre) => {
  const [deployer, user, userTwo, userThree] = await hre.ethers.getSigners()

  const learnNGrow = LearnNGrow__factory.connect(contractAddress, deployer)

  await waitForTx(
    learnNGrow.connect(user).createProfile({
      handle: 'chimpanzee.eth',
      imageURI:
        'https://gateway.pinata.cloud/ipfs/QmazakVDvNYEnQjFNWTKDYdkhujawPS2kNz2L6ty6MKmcx',
    })
  )

  await waitForTx(
    learnNGrow.connect(userTwo).createProfile({
      handle: 'elephant.eth',
      imageURI:
        'https://gateway.pinata.cloud/ipfs/QmbkEJNQ9cj5DNcPS2LvqTyhAUAq2FhmK9GfjKqPB7G9Z2',
    })
  )

  await waitForTx(
    learnNGrow.connect(userThree).createProfile({
      handle: 'coq.eth',
      imageURI:
        'https://gateway.pinata.cloud/ipfs/QmVBiWuvd3LZDafCJbWJWCb3cXrwKLYqrRhsjHPRrBja8k',
    })
  )
})
