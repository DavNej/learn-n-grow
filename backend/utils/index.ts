import { ContractTransaction } from 'ethers'

export const getParamOrExit = (name: string) => {
  const param = process.env[name]
  if (!param) {
    console.error(`Required config param '${name}' missing`)
    process.exit(1)
  }
  return param
}

export async function waitForTx(tx: Promise<ContractTransaction>) {
  await (await tx).wait()
}
