import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { hashWithSha256 } from '@/utils'
import { encodeJsonToDataUri } from './dataUri'

export const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs/'

const baseUrl = 'https://api.pinata.cloud/pinning'
const JWT = `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`

type Args = [string, FormData | string, AxiosRequestConfig]

function buildPinJsonArgs(json: object): Args {
  const name = hashWithSha256(json)
  const pinataContent = encodeJsonToDataUri(json)

  const data = JSON.stringify({
    pinataOptions: { cidVersion: 1 },
    pinataMetadata: { name },
    pinataContent,
  })

  const headers = {
    'Content-Type': 'application/json',
    Authorization: JWT,
  }

  return [baseUrl + '/pinJSONToIPFS', data, { headers }]
}

export function upload(json: object, callback: (ipfsHash: string) => void) {
  const axiosArgs = buildPinJsonArgs(json)

  axios.post(...axiosArgs).then(res => {
    callback(res.data.IpfsHash)
  })
}
