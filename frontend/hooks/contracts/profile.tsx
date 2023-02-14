import {
  Address,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'

import type { ILearnNGrowWriteFunctionName } from '@/utils/types'
import type { DataTypes } from '@/utils/LearnNGrow'
import { address, abi } from '@/utils/contract'

import useErrorHandling from '../useErrorHandling'

export function useProfile({
  enabled,
  addr,
}: {
  enabled: boolean
  addr: Address
}) {
  const { data } = useContractRead({
    address,
    abi,
    enabled,
    functionName: 'profile',
    args: [addr],
  })

  if (!data) return null

  return data
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

  let options = {
    address,
    abi,
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
