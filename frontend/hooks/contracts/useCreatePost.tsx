import {
  useContractWrite,
  usePrepareContractWrite,
  useContractEvent,
  useWaitForTransaction,
} from 'wagmi'

import { useToast } from '@chakra-ui/react'
import { defaultToastContent } from '@/utils'

import type { ILearnNGrowWriteFunctionName } from '@/utils/types'
import { eventsLib, learnNGrow } from '@/utils/contracts'

import useErrorHandling from '../useErrorHandling'
import { BigNumber, ethers } from 'ethers'

export function useCreatePost({
  profileId = 0,
  contentURI,
}: {
  profileId: number
  contentURI: string
}) {
  const functionName: ILearnNGrowWriteFunctionName = 'post'

  const enabled = !!contentURI && !!profileId

  const args: readonly [{ profileId: BigNumber; contentURI: string }] = [
    { profileId: ethers.BigNumber.from(profileId), contentURI },
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
    eventName: 'PostCreated',
    listener(...args) {
      console.warn(args)
      toast({
        ...defaultToastContent,
        title: 'Success',
        description: `Post created 🎉`,
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
