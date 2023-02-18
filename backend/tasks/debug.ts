import '@nomicfoundation/hardhat-toolbox'

import { task } from 'hardhat/config'
import { LearnNGrow__factory } from '../typechain-types/index'

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

task('debug', 'Debug task').setAction(async (_, hre) => {
  const [deployer, user, userTwo, userThree] = await hre.ethers.getSigners()

  const learnNGrow = LearnNGrow__factory.connect(contractAddress, deployer)

  console.log(learnNGrow)
})
