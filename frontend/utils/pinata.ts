import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { hashWithSha256 } from '@/utils'
import { encodeJsonToDataUri } from './dataUri'

const baseUrl = 'https://api.pinata.cloud/pinning'
const JWT = `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`

type Args = [string, FormData | string, AxiosRequestConfig]

function buildPinFileArgs(file: File): Args {
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

export function upload(
  data: File | object,
  callback: (ipfsHash: string) => void
) {
  const axiosArgs =
    data instanceof File ? buildPinFileArgs(data) : buildPinJsonArgs(data)

  axios.post(...axiosArgs).then(res => {
    callback(res.data.IpfsHash)
  })
}
