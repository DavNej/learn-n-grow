import {
  useContractEvent,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'

import { useToast } from '@chakra-ui/react'
import { defaultToastContent } from '@/utils'

import type { ILearnNGrowWriteFunctionName } from '@/utils/types'
import { eventsLib, learnNGrow } from '@/utils/contracts'

import useErrorHandling from '../useErrorHandling'

export function useCreateProfile({
  handle,
  imageURI,
  onSuccess,
}: {
  handle: string
  imageURI: string
  onSuccess: () => void
}) {
  const functionName: ILearnNGrowWriteFunctionName = 'createProfile'
  const args: readonly [{ handle: string; imageURI: string }] = [
    { handle, imageURI },
  ]

  const options = {
    ...learnNGrow,
    functionName,
    args,
    enabled: !!handle && !!imageURI,
  }

  const {
    config,
    isError: isPrepareError,
    error: prepareError,
  } = usePrepareContractWrite(options)

  const { data, write, error: writeError } = useContractWrite(config)

  const error = useErrorHandling({
    error: prepareError || writeError,
    args,
    enabled: !isPrepareError,
  })

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  const toast = useToast()

  useContractEvent({
    address: learnNGrow.address,
    abi: eventsLib.abi,
    eventName: 'ProfileCreated',
    listener(...args) {
      if (isSuccess) {
        console.warn(args)
        toast({
          ...defaultToastContent,
          title: 'Success',
          description: `Profile created 🎨`,
          status: 'success',
        })
        onSuccess()
      }
    },
  })

  return {
    data,
    write,
    isPrepareError,
    error,
    isLoading,
    isSuccess,
  }
}
