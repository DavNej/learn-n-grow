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

export function useCreateComment({
  profileId = 0,
  contentURI,
  profileIdPointed,
  pubIdPointed,
  onSuccess,
}: {
  profileId: number
  contentURI: string
  profileIdPointed: number
  pubIdPointed: number
  onSuccess: () => void
}) {
  const functionName: ILearnNGrowWriteFunctionName = 'comment'
  const args: readonly [
    {
      profileId: BigNumber
      contentURI: string
      profileIdPointed: BigNumber
      pubIdPointed: BigNumber
    }
  ] = [
    {
      profileId: ethers.BigNumber.from(profileId),
      contentURI,
      profileIdPointed: ethers.BigNumber.from(profileIdPointed),
      pubIdPointed: ethers.BigNumber.from(pubIdPointed),
    },
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
    eventName: 'CommentCreated',
    listener(...args) {
      if (isSuccess) {
        console.warn(args)
        toast({
          ...defaultToastContent,
          title: 'Success',
          description: `Comment created 🎉`,
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
