import '@nomicfoundation/hardhat-toolbox'

import { task } from 'hardhat/config'
import { LearnNGrow__factory } from '../typechain-types/index'
import { waitForTx } from '../utils'
import { CONTRACT_ADDRESS } from '../utils/constants'

task('seed-posts', 'Populate posts').setAction(async (_, hre) => {
  const [deployer, user, userTwo, userThree, userFour] =
    await hre.ethers.getSigners()

  const learnNGrow = LearnNGrow__factory.connect(CONTRACT_ADDRESS, deployer)

  const userProfileId = await learnNGrow.profile(user.address)
  await waitForTx(
    learnNGrow.connect(user).post({
      profileId: userProfileId,
      contentURI:
        'https://gateway.pinata.cloud/ipfs/bafkreietegics3pwarjrowo5utu6fzjfk4zx6o7x7asln6fmen4jbbv7tu',
    })
  )

  const userTwoProfileId = await learnNGrow.profile(userTwo.address)
  await waitForTx(
    learnNGrow.connect(userTwo).post({
      profileId: userTwoProfileId,
      contentURI:
        'https://gateway.pinata.cloud/ipfs/bafkreifdlrfon7354xtndyfnxqyd2up4po4c6sa2ofxwavjuy3eey57zs4',
    })
  )

  const userThreeProfileId = await learnNGrow.profile(userThree.address)
  await waitForTx(
    learnNGrow.connect(userThree).post({
      profileId: userThreeProfileId,
      contentURI:
        'https://gateway.pinata.cloud/ipfs/bafkreidiyjsdvnpovmajjiplum2q5azfbeq4gyoc5nt6wg4ydcokrr44wq',
    })
  )

  const userFourProfileId = await learnNGrow.profile(userFour.address)
  await waitForTx(
    learnNGrow.connect(userFour).post({
      profileId: userFourProfileId,
      contentURI:
        'https://gateway.pinata.cloud/ipfs/bafkreihpbeqpcmrgia7y7tom6jpcfezn2747l46xo74byrw7rlmp24jliy',
    })
  )
})
