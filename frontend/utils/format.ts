import { Contract } from 'ethers'

function extractErrorMessage(contract: Contract, error: Error) {
  let reason

  console.error(error)

  // Custom error
  try {
    // @ts-ignore
    const data = error?.error.data.data.data
    reason = contract?.interface.parseError(data).name
  } catch (err) {
    // Require error
    reason = error?.message || 'An error occured'
  }

  console.warn(reason)

  return reason
}

export function formatError(contract: Contract, error: Error) {
  const message = extractErrorMessage(contract, error)

  if (message.includes('HandleContainsInvalidCharacters')) {
    return 'Handle contains invalid characters'
  }

  return message
}
