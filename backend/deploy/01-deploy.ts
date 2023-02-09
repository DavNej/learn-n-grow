import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'

import { verify } from '../utils/verify'
import {
  LEARN_N_GROW_NFT_NAME,
  LEARN_N_GROW_NFT_SYMBOL,
} from '../utils/constants'
import { developmentChains, blockConfirmations } from '../helper-hardhat-config'

const deploymentArgs = [LEARN_N_GROW_NFT_NAME, LEARN_N_GROW_NFT_SYMBOL]

const deploy: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  network,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const isProduction = !developmentChains.includes(network.name)

  const LearnNGrow = await deploy('LearnNGrow', {
    from: deployer,
    args: deploymentArgs,
    waitConfirmations: isProduction ? blockConfirmations : 1,
  })

  //Verify the smart contract
  if (isProduction && process.env.ETERSCAN_API_KEY) {
    await verify(LearnNGrow.address, deploymentArgs)
  }
}

export default deploy
