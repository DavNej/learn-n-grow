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
  if (message.includes('HandleLengthInvalid')) {
    return 'Handle too long'
  }
  if (message.includes('HandleTaken')) {
    return 'Handle already taken'
  }
  if (message.includes('ProfileImageURILengthInvalid')) {
    return "Profile's image URI is too long"
  }
  if (message.includes('ProfileImageURIEmpty')) {
    return "Profile's image URI empty"
  }
  if (message.includes('NotProfileOwner')) {
    return 'You are not the profile owner'
  }
  if (message.includes('UnsafeURI')) {
    return 'URI contains illegal characters'
  }
  if (message.includes('PublicationDoesNotExist')) {
    return 'Publication does not exist'
  }
  if (message.includes('CannotCommentOnSelf')) {
    return 'Cannot comment on self'
  }

  return message
}
