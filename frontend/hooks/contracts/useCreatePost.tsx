import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'

import type { ILearnNGrowWriteFunctionName } from '@/utils/types'
import learnNGrowContract from '@/utils/contract'

import useErrorHandling from '../useErrorHandling'
import { BigNumber, ethers } from 'ethers'

export function useCreatePost({
  profileId,
  contentURI,
}: {
  profileId: number
  contentURI: string
}) {
  const functionName: ILearnNGrowWriteFunctionName = 'post'

  const enabled = !!contentURI && !!profileId

  if (!enabled) return {}

  const args: readonly [{ profileId: BigNumber; contentURI: string }] = [
    { profileId: ethers.BigNumber.from(profileId), contentURI },
  ]

  const options = {
    ...learnNGrowContract,
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

  return {
    data,
    write,
    isPrepareError,
    error,
    isLoading,
    isSuccess,
  }
}
