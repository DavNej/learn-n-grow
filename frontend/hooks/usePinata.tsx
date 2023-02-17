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

  const upload = useCallback(
    ({
      data,
      onSuccess,
      onError,
    }: {
      data: File | Object
      onSuccess: (uri: string) => void
      onError?: Function
    }): void => {
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
          const uri = PINATA_GATEWAY + res.data.IpfsHash
          onSuccess(uri)
          setIsSuccess(true)
        })
        .catch(error => {
          onError?.(error)
        })
        .finally(() => setIsLoading(false))
    },
    []
  )

  return {
    upload,
    isSuccess,
    isLoading,
  }
}
