import { run } from 'hardhat'

export async function verify(contractAddress: string, args: unknown[]) {
  console.log('Verifying contract...')
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    })
    console.log('Contract successfully verified ✅')
  } catch (err: any) {
    if (err.message.toLowerCase().includes('already verified')) {
      console.log('Contract already verified 😖')
    } else {
      console.log(err)
    }
  }
}
