import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'

import { verify } from '../utils/verify'
import { developmentChains, blockConfirmations } from '../helper-hardhat-config'

const deploymentArgs = ['baseRUI']

const deploy: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  network,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const isProduction = !developmentChains.includes(network.name)

  const LNGProfile = await deploy('LNGProfile', {
    from: deployer,
    args: deploymentArgs,
    waitConfirmations: isProduction ? blockConfirmations : 1,
  })

  //Verify the smart contract
  if (isProduction && process.env.ETERSCAN_API_KEY) {
    await verify(LNGProfile.address, deploymentArgs)
  }
}

export default deploy
