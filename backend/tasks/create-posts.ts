import '@nomicfoundation/hardhat-toolbox'

import { task } from 'hardhat/config'
import { LearnNGrow__factory } from '../typechain-types/index'
import { waitForTx } from '../utils'
import { CONTRACT_ADDRESS } from '../utils/constants'

task('create-posts', 'Populate posts').setAction(async (_, hre) => {
  const [deployer, user, userTwo, userThree] = await hre.ethers.getSigners()

  const learnNGrow = LearnNGrow__factory.connect(CONTRACT_ADDRESS, deployer)

  const userProfileId = await learnNGrow.profile(user.address)
  await waitForTx(
    learnNGrow.connect(user).post({
      profileId: userProfileId,
      contentURI:
        'https://gateway.pinata.cloud/ipfs/bafkreigkbol2sdv2zzx7gkgooephmt6jftk5g5jtmb7gkk2qmjxwxegwhq',
    })
  )

  const userTwoProfileId = await learnNGrow.profile(userTwo.address)
  await waitForTx(
    learnNGrow.connect(userTwo).post({
      profileId: userTwoProfileId,
      contentURI:
        'https://gateway.pinata.cloud/ipfs/bafkreibddjzdanba2sz3r5habkk2obtfpgf2baqnn3sjc2drrtpwt22kae',
    })
  )

  const userThreeProfileId = await learnNGrow.profile(userThree.address)
  await waitForTx(
    learnNGrow.connect(userThree).post({
      profileId: userThreeProfileId,
      contentURI:
        'https://gateway.pinata.cloud/ipfs/bafkreidwxv2fwzp26rrhm43r3ii5xvlgvokbqgvfaevm5qsnqhufzlrjhe',
    })
  )
})
