import { useQuery } from 'react-query'
import type { UseQueryOptions } from 'react-query'
import type { Contract } from 'ethers'

import { ProfileRecord } from '@/utils/types'
import { useStore } from '../useStore'

type QueryOptions = Omit<
  UseQueryOptions<ProfileRecord, Error, ProfileRecord, string>,
  'queryKey' | 'queryFn'
>

const MAX_PROFILE_COUNT = 20

export default function useProfiles(options?: QueryOptions) {
  const { store } = useStore()
  const { learnNGrowContract } = store

  const defaultOptions = {
    enabled: options?.enabled !== false,
  }

  const queryOptions: QueryOptions = { ...defaultOptions, ...(options || {}) }

  return useQuery<ProfileRecord, Error, ProfileRecord, string>(
    'getProfiles',
    getProfiles(learnNGrowContract),
    queryOptions
  )
}

function getProfiles(learnNGrowContract: Contract | undefined) {
  return async function () {
    if (!learnNGrowContract) return []

    const profilesById: ProfileRecord = {}

    for (let i = 1; i <= MAX_PROFILE_COUNT; i++) {
      const profile = await learnNGrowContract.getProfile(i)

      if (!profile.handle) {
        return profilesById
      }

      profilesById[i] = {
        id: i,
        handle: profile.handle,
        imageURI: profile.imageURI,
        pubCount: profile.pubCount.toNumber(),
      }
    }

    return profilesById
  }
}
