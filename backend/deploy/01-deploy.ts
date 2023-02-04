import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'

import { verify } from '../utils/verify'
import { developmentChains, blockConfirmations } from '../helper-hardhat-config'

const deploy: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  network,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const isProduction = !developmentChains.includes(network.name)

  log('--------------------------------------')
  const args: [] = []

  const Storage = await deploy('Storage', {
    from: deployer,
    args,
    log: true,
    waitConfirmations: isProduction ? blockConfirmations : 1,
  })

  //Verify the smart contract
  if (isProduction && process.env.ETERSCAN_API_KEY) {
    log('Verifying...')
    await verify(Storage.address, args)
  }
}

deploy.tags = ['all', 'main', 'simple-storage']

export default deploy
