import {
  buildPinFileArgs,
  buildPinJsonArgs,
  PINATA_GATEWAY,
} from '@/utils/pinata'
import axios from 'axios'

import { useState, useCallback } from 'react'

export function usePinata() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<unknown | null>(null)
  const [dataURI, setDataURI] = useState<string | null>(null)

  const upload = useCallback((data: File | Object): void => {
    let axiosArgs

    if (data instanceof File) {
      axiosArgs = buildPinFileArgs(data)
    } else {
      axiosArgs = buildPinJsonArgs(data)
    }

    setIsLoading(true)

    axios
      .post(...axiosArgs)
      .then(res => {
        setDataURI(PINATA_GATEWAY + res.data.IpfsHash)
        setIsSuccess(true)
      })
      .catch(error => setError(error))
      .finally(() => setIsLoading(false))
  }, [])

  return {
    dataURI,
    upload,
    isSuccess,
    isLoading,
    error,
  }
}
