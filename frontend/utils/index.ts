import { UseToastOptions } from '@chakra-ui/react'

export function isUndefined(arg: unknown | undefined) {
  return typeof arg === 'undefined'
}

export const isEthereumAddress = (address: string | undefined): boolean => {
  if (
    typeof address === 'undefined' ||
    typeof address !== 'string' ||
    address.length !== 42
  ) {
    return false
  }

  const pattern = /^0x[a-fA-F0-9]{40}$/

  return pattern.test(address)
}

export const defaultToastContent: Partial<UseToastOptions> = {
  position: 'bottom-left',
  duration: 5200,
  isClosable: true,
}
