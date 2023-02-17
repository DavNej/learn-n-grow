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
}: {
  handle: string
  imageURI: string
}) {
  const enabled = !!handle && !!imageURI

  const functionName: ILearnNGrowWriteFunctionName = 'createProfile'
  const args: readonly [{ handle: string; imageURI: string }] = [
    { handle, imageURI },
  ]

  const options = {
    ...learnNGrow,
    functionName,
    args,
    enabled,
  }

  const {
    config,
    isError: isPrepareError,
    error: prepareError,
  } = usePrepareContractWrite(options)

  const { data, write, error: writeError } = useContractWrite(config)

  const error = prepareError || writeError

  useErrorHandling({ error, args })

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  const toast = useToast()

  useContractEvent({
    address: learnNGrow.address,
    abi: eventsLib.abi,
    eventName: 'ProfileCreated',
    listener(...args) {
      console.warn(args)
      toast({
        ...defaultToastContent,
        title: 'Success',
        description: `Profile created 🎨`,
        status: 'success',
      })
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
