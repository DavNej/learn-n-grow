import '@nomicfoundation/hardhat-toolbox'

import { task } from 'hardhat/config'
import { LearnNGrow__factory } from '../typechain-types/index'
import { waitForTx } from '../utils'
import {
  LOCAL_CONTRACT_ADDRESS,
  GOERLI_CONTRACT_ADDRESS,
} from '../utils/constants'

let contractAddress = LOCAL_CONTRACT_ADDRESS

task('seed-comments', 'Populate comments').setAction(async (_, hre) => {
  const [deployer, user, userTwo, userThree, userFour] =
    await hre.ethers.getSigners()

  if (hre.network.name === 'goerli') {
    contractAddress = GOERLI_CONTRACT_ADDRESS
  }

  const learnNGrow = LearnNGrow__factory.connect(contractAddress, deployer)

  const userProfileId = await learnNGrow.profile(user.address)
  const userTwoProfileId = await learnNGrow.profile(userTwo.address)
  const userThreeProfileId = await learnNGrow.profile(userThree.address)
  const userFourProfileId = await learnNGrow.profile(userFour.address)

  await waitForTx(
    learnNGrow.connect(user).comment({
      profileId: userProfileId,
      profileIdPointed: userTwoProfileId,
      pubIdPointed: hre.ethers.BigNumber.from(1),
      contentURI: 'bafkreia6th5nxyiur6frdz6spvfh2fj4ce4l4h4h22hlklzqxn2mdtqb7e',
    })
  )

  await waitForTx(
    learnNGrow.connect(userTwo).comment({
      profileId: userTwoProfileId,
      profileIdPointed: userProfileId,
      pubIdPointed: hre.ethers.BigNumber.from(1),
      contentURI: 'bafkreies4uj57kn242fuxnwog4yddffzs32f33zgw7hlkmpnansyl7rz4m',
    })
  )

  await waitForTx(
    learnNGrow.connect(userThree).comment({
      profileId: userThreeProfileId,
      profileIdPointed: userFourProfileId,
      pubIdPointed: hre.ethers.BigNumber.from(1),
      contentURI: 'bafkreih4zmghxzex6op76deb3q6fn6nme26ebktsc2kzt2qdkqvte4yoia',
    })
  )

  await waitForTx(
    learnNGrow.connect(userThree).comment({
      profileId: userThreeProfileId,
      profileIdPointed: userTwoProfileId,
      pubIdPointed: hre.ethers.BigNumber.from(1),
      contentURI: 'bafkreigts3ddfpib3cvbwyptrx3vbp6e4dpl7ev4l6kbltlo2rgtu4the4',
    })
  )
})
