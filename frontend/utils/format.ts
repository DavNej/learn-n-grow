export function formatError(message: string | undefined, args: string) {
  if (typeof message === 'undefined') {
    return 'An error occured'
  }

  if (message.includes('Ownable: caller is not the owner')) {
    return 'Action can only be done by owner'
  }

  return message
}
