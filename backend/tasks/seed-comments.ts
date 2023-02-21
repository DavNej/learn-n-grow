import '@nomicfoundation/hardhat-toolbox'

import { task } from 'hardhat/config'
import { LearnNGrow__factory } from '../typechain-types/index'
import { waitForTx } from '../utils'
import { CONTRACT_ADDRESS } from '../utils/constants'

task('seed-comments', 'Populate comments').setAction(async (_, hre) => {
  const [deployer, user, userTwo, userThree, userFour] =
    await hre.ethers.getSigners()

  const learnNGrow = LearnNGrow__factory.connect(CONTRACT_ADDRESS, deployer)

  const userProfileId = await learnNGrow.profile(user.address)
  const userTwoProfileId = await learnNGrow.profile(userTwo.address)
  const userThreeProfileId = await learnNGrow.profile(userThree.address)
  const userFourProfileId = await learnNGrow.profile(userFour.address)

  await waitForTx(
    learnNGrow.connect(user).comment({
      profileId: userProfileId,
      profileIdPointed: userTwoProfileId,
      pubIdPointed: hre.ethers.BigNumber.from(1),
      contentURI:
        'https://gateway.pinata.cloud/ipfs/bafkreiawk23ab4q2uzhkn66lganq4wst4zvkw4k6k23dyqtyqptxhfkeda',
    })
  )

  await waitForTx(
    learnNGrow.connect(userTwo).comment({
      profileId: userTwoProfileId,
      profileIdPointed: userProfileId,
      pubIdPointed: hre.ethers.BigNumber.from(1),
      contentURI:
        'https://gateway.pinata.cloud/ipfs/bafkreidcxtz4xmfrzik22nk4ozs4ujzn23sitbmg6joald4eo5b3ok2n7u',
    })
  )

  await waitForTx(
    learnNGrow.connect(userThree).comment({
      profileId: userThreeProfileId,
      profileIdPointed: userFourProfileId,
      pubIdPointed: hre.ethers.BigNumber.from(1),
      contentURI:
        'https://gateway.pinata.cloud/ipfs/bafkreicntdieylmjnw6drpc6ez3rc4nnsi6c2nbemf5jvkkvq3s46pemci',
    })
  )

  await waitForTx(
    learnNGrow.connect(userThree).comment({
      profileId: userThreeProfileId,
      profileIdPointed: userFourProfileId,
      pubIdPointed: hre.ethers.BigNumber.from(1),
      contentURI:
        'https://gateway.pinata.cloud/ipfs/bafkreia66vnpuahyjujdeqo5bidxio2qvludif5lq4th54qui5tuuicxwa',
    })
  )
})