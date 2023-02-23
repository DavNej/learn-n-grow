import { UseToastOptions } from '@chakra-ui/react'
import { createHash } from 'crypto'
import { Address } from 'wagmi'
import { PINATA_GATEWAY } from './pinata'

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
  position: 'bottom-right',
  duration: 5200,
  isClosable: true,
}

export function hashWithSha256(data: unknown): string {
  const hash = createHash('sha256')
  hash.update(JSON.stringify(data))
  return hash.digest('hex')
}

export function serialize(obj: any) {
  function replacer(_: any, value: any) {
    if (value instanceof Map) {
      return Object.fromEntries(value)
    }
    return value
  }
  const str = JSON.stringify(obj, replacer)
  return JSON.parse(str)
}

export function flatten(obj: any) {
  function replacer(_: any, value: any) {
    if (value instanceof Map) {
      return Array.from(value.values())
    }
    return value
  }
  const str = JSON.stringify(obj, replacer)

  return JSON.parse(str).flat()
}

export function buildPublication({
  content,
  mediaURI,
  address,
}: {
  content: string
  mediaURI: string
  address: Address
}) {
  const common = {
    content,
    creationDate: Date.now(),
    author: address,
  }

  return !!mediaURI ? { ...common, mediaURI } : { ...common }
}

const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs/'
// const IPFS_GATEWAY = 'https://gateway.ipfs.io/ipfs/'

export function urlFromCid(cid: string) {
  return IPFS_GATEWAY + cid
}

export function cidFromUrl(url: string) {
  return url.replace(IPFS_GATEWAY, '')
}
