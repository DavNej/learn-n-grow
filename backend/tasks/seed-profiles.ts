import '@nomicfoundation/hardhat-toolbox'

import { task } from 'hardhat/config'
import { LearnNGrow__factory } from '../typechain-types/index'
import { waitForTx } from '../utils'
import {
  LOCAL_CONTRACT_ADDRESS,
  GOERLI_CONTRACT_ADDRESS,
} from '../utils/constants'

let contractAddress = LOCAL_CONTRACT_ADDRESS

task('seed-profiles', 'Populate profiles').setAction(async (_, hre) => {
  const [deployer, user, userTwo, userThree, userFour] =
    await hre.ethers.getSigners()

  if (hre.network.name === 'goerli') {
    contractAddress = GOERLI_CONTRACT_ADDRESS
  }

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

  await waitForTx(
    learnNGrow.connect(userFour).createProfile({
      handle: 'heron.eth',
      imageURI:
        'https://gateway.pinata.cloud/ipfs/QmRudXHS2XvkYfaDSNowzJvirSZQAqki7Z5ULHizHhv5iG',
    })
  )
})
