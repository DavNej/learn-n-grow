import '@nomicfoundation/hardhat-toolbox'

import { task } from 'hardhat/config'
import { LearnNGrow__factory } from '../typechain-types/index'
import { waitForTx } from '../utils'
import { CONTRACT_ADDRESS } from '../utils/constants'

task('create-comments', 'Populate comments').setAction(async (_, hre) => {
  const [deployer, user, userTwo, userThree] = await hre.ethers.getSigners()

  const learnNGrow = LearnNGrow__factory.connect(CONTRACT_ADDRESS, deployer)

  const userProfileId = await learnNGrow.profile(user.address)
  const userTwoProfileId = await learnNGrow.profile(userTwo.address)
  const userThreeProfileId = await learnNGrow.profile(userThree.address)

  await waitForTx(
    learnNGrow.connect(user).comment({
      profileId: userProfileId,
      profileIdPointed: userTwoProfileId,
      pubIdPointed: hre.ethers.BigNumber.from(1),
      contentURI:
        'https://gateway.pinata.cloud/ipfs/bafkreibddjzdanba2sz3r5habkk2obtfpgf2baqnn3sjc2drrtpwt22kae',
    })
  )

  await waitForTx(
    learnNGrow.connect(userTwo).comment({
      profileId: userTwoProfileId,
      profileIdPointed: userTwoProfileId,
      pubIdPointed: hre.ethers.BigNumber.from(1),
      contentURI:
        'https://gateway.pinata.cloud/ipfs/bafkreibddjzdanba2sz3r5habkk2obtfpgf2baqnn3sjc2drrtpwt22kae',
    })
  )

  await waitForTx(
    learnNGrow.connect(userThree).comment({
      profileId: userThreeProfileId,
      profileIdPointed: userTwoProfileId,
      pubIdPointed: hre.ethers.BigNumber.from(1),
      contentURI:
        'https://gateway.pinata.cloud/ipfs/bafkreidwxv2fwzp26rrhm43r3ii5xvlgvokbqgvfaevm5qsnqhufzlrjhe',
    })
  )
})
