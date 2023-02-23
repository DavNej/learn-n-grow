import '@nomicfoundation/hardhat-toolbox'

import { task } from 'hardhat/config'
import { LearnNGrow__factory } from '../typechain-types/index'
import { waitForTx } from '../utils'
import {
  LOCAL_CONTRACT_ADDRESS,
  GOERLI_CONTRACT_ADDRESS,
} from '../utils/constants'

let contractAddress = LOCAL_CONTRACT_ADDRESS

task('seed-posts', 'Populate posts').setAction(async (_, hre) => {
  const [deployer, user, userTwo, userThree, userFour] =
    await hre.ethers.getSigners()

  if (hre.network.name === 'goerli') {
    contractAddress = GOERLI_CONTRACT_ADDRESS
  }

  const learnNGrow = LearnNGrow__factory.connect(contractAddress, deployer)

  const userProfileId = await learnNGrow.profile(user.address)
  await waitForTx(
    learnNGrow.connect(user).post({
      profileId: userProfileId,
      contentURI: 'bafkreig6477xhh7bv4gp5rs26ht6ju3tpw7italmoclyqjow3kydjkxojy',
    })
  )

  const userTwoProfileId = await learnNGrow.profile(userTwo.address)
  await waitForTx(
    learnNGrow.connect(userTwo).post({
      profileId: userTwoProfileId,
      contentURI: 'bafkreifjutky4cpkkoi5bbbkzygiz445rhcambv44f37pl2vdahbql6mwe',
    })
  )

  const userThreeProfileId = await learnNGrow.profile(userThree.address)
  await waitForTx(
    learnNGrow.connect(userThree).post({
      profileId: userThreeProfileId,
      contentURI: 'bafkreie7dzfx74wqii4c7pfovoooldjxxr7u2xws7emoazt3xypmprsvr4',
    })
  )

  const userFourProfileId = await learnNGrow.profile(userFour.address)
  await waitForTx(
    learnNGrow.connect(userFour).post({
      profileId: userFourProfileId,
      contentURI: 'bafkreif7qejrflpjc4j7gfnfacfzrak4ctj36nsnbxjhdmzc47t6firfa4',
    })
  )
})
