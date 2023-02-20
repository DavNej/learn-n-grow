import { BigNumber, ethers } from 'ethers'
import {
  useContractWrite,
  usePrepareContractWrite,
  useContractEvent,
  useWaitForTransaction,
} from 'wagmi'

import { useToast } from '@chakra-ui/react'
import { defaultToastContent } from '@/utils'
import { eventsLib, learnNGrow } from '@/utils/contracts'
import type { ILearnNGrowWriteFunctionName } from '@/utils/types'

import useErrorHandling from '../useErrorHandling'

export function useCreatePost({
  profileId = 0,
  contentURI,
  onSuccess,
}: {
  profileId: number
  contentURI: string
  onSuccess: () => void
}) {
  const functionName: ILearnNGrowWriteFunctionName = 'post'
  const args: readonly [{ profileId: BigNumber; contentURI: string }] = [
    { profileId: ethers.BigNumber.from(profileId), contentURI },
  ]

  const options = {
    ...learnNGrow,
    functionName,
    args,
    enabled: !!contentURI && !!profileId,
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
    eventName: 'PostCreated',
    listener(...args) {
      if (isSuccess) {
        console.warn(args)
        toast({
          ...defaultToastContent,
          title: 'Success',
          description: `Post created 🎉`,
          status: 'success',
        })
      }
    },
  })

  if (isSuccess) {
    onSuccess()
  }

  return {
    data,
    write,
    isPrepareError,
    error,
    isLoading,
    isSuccess,
  }
}
