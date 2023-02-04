import { run } from 'hardhat'

export async function verify(contractAddress: string, args: any[]) {
  console.log('Verifying contract...')
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (err: any) {
    if (err.message.toLowerCase().includes('already verified')) {
      console.log('Already verified!')
    } else {
      console.log(err)
    }
  }
}
