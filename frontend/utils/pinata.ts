import { Address } from 'wagmi'
import axios from 'axios'

const baseUrl = 'https://api.pinata.cloud/pinning'
const JWT = `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`

export async function pinFile(file: File, address: Address) {
  const formData = new FormData()

  const metadata = JSON.stringify({ name: `${address}-avatar` })
  formData.append('pinataMetadata', metadata)

  const options = JSON.stringify({ cidVersion: 0 })
  formData.append('pinataOptions', options)

  formData.append('file', file)

  const headers = {
    'Content-Type': 'multipart/form-data',
    Authorization: JWT,
  }

  try {
    const res = await axios.post(baseUrl + '/pinFileToIPFS', formData, {
      headers,
    })
    return { ipfsHash: res.data.IpfsHash, isSuccess: true }
  } catch (error) {
    console.error(error)
    return { isError: true, error }
  }
}

export async function pinJson(json: Object, address: Address) {
  const content = JSON.stringify(json)

  const data = JSON.stringify({
    pinataOptions: { cidVersion: 1 },
    pinataMetadata: { name: `${address}-json` },
    pinataContent: content,
  })

  const headers = {
    'Content-Type': 'application/json',
    Authorization: JWT,
  }

  try {
    const res = await axios.post(baseUrl + '/pinJSONToIPFS', data, { headers })
    return { ipfsHash: res.data.IpfsHash, isSuccess: true }
  } catch (error) {
    console.error(error)
    return { isError: true, error }
  }
}
