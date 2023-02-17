import type { AxiosRequestConfig } from 'axios'
import { hashWithSha256 } from '@/utils'

export const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs/'

const baseUrl = 'https://api.pinata.cloud/pinning'
const JWT = `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`

type Args = [string, FormData | string, AxiosRequestConfig]

export function buildPinFileArgs(file: File): Args {
  const formData = new FormData()

  const name = hashWithSha256(file)
  const metadata = JSON.stringify({ name })
  formData.append('pinataMetadata', metadata)

  const options = JSON.stringify({ cidVersion: 0 })
  formData.append('pinataOptions', options)

  formData.append('file', file)

  const headers = {
    'Content-Type': 'multipart/form-data',
    Authorization: JWT,
  }

  return [baseUrl + '/pinFileToIPFS', formData, { headers }]
}

export function buildPinJsonArgs(json: Object): Args {
  const name = hashWithSha256(json)
  const data = JSON.stringify({
    pinataOptions: { cidVersion: 1 },
    pinataMetadata: { name },
    pinataContent: json,
  })

  const headers = {
    'Content-Type': 'application/json',
    Authorization: JWT,
  }

  return [baseUrl + '/pinJSONToIPFS', data, { headers }]
}
