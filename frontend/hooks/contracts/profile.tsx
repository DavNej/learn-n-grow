import {
  Address,
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'

import type {
  ILearnNGrowReadFunctionName,
  ILearnNGrowWriteFunctionName,
} from '@/utils/types'
import type { DataTypes } from '@/utils/LearnNGrow'
import learnNGrowContract from '@/utils/contract'
import type { LearnNGrowAbi } from '@/utils/contract'

import useErrorHandling from '../useErrorHandling'
import { BigNumber } from 'ethers'

export function useProfile({
  enabled,
  address,
}: {
  enabled: boolean
  address: Address | undefined
}) {
  const functionName: ILearnNGrowReadFunctionName = 'profile'

  const options: UseContractReadConfig<LearnNGrowAbi> = {
    ...learnNGrowContract,
    functionName,
    enabled: false,
  }

  if (enabled && address) {
    options.args = [address]
    options.enabled = true
    options.functionName = functionName
  }

  const { data } = useContractRead(options)

  if (!data) return null

  return data as BigNumber
}

export function useCreateProfile({
  vars,
  enabled,
}: {
  vars: DataTypes.CreateProfileDataStruct
  enabled: boolean
}) {
  const functionName: ILearnNGrowWriteFunctionName = 'createProfile'
  let args: readonly [DataTypes.CreateProfileDataStruct] = [
    { handle: '', imageURI: '' },
  ]

  const options = {
    ...learnNGrowContract,
    functionName,
    args,
    enabled: false,
  }

  if (enabled) {
    options.args = [{ handle: vars.handle, imageURI: vars.imageURI }]
    options.enabled = true
  }

  const {
    config,
    isError: isPrepareError,
    error: prepareError,
  } = usePrepareContractWrite(options)

  const { data, write, error: writeError } = useContractWrite(config)

  const error = prepareError || writeError

  useErrorHandling({ error, args: String(options?.args) })

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
