import { useQuery } from 'react-query'
import type { UseQueryOptions } from 'react-query'
import type { Contract } from 'ethers'

import { IProfile } from '@/utils/types'
import { useStore } from '../useStore'
import { Address, useAccount } from 'wagmi'

type QueryOptions = Omit<
  UseQueryOptions<IProfile | null, Error, IProfile | null, string>,
  'queryKey' | 'queryFn'
>

export default function useProfile(options?: QueryOptions) {
  const { store } = useStore()
  const { learnNGrowContract } = store

  const { address } = useAccount()

  const defaultOptions = {
    enabled: options?.enabled !== false,
  }

  const queryOptions: QueryOptions = { ...defaultOptions, ...(options || {}) }

  return useQuery<IProfile | null, Error, IProfile | null, string>(
    'getProfile',
    getProfile(learnNGrowContract, address),
    queryOptions
  )
}

function getProfile(
  learnNGrowContract: Contract | undefined,
  address: Address | undefined
) {
  return async function () {
    if (!learnNGrowContract || !address) return null

    const profileId = await learnNGrowContract.profile(address)

    if (profileId.toNumber() === 0) {
      return null
    }

    const res = await learnNGrowContract.getProfile(profileId)

    const profile = {
      id: profileId.toNumber(),
      imageURI: res.imageURI,
      handle: res.handle,
      pubCount: res.pubCount,
    }

    return profile
  }
}
