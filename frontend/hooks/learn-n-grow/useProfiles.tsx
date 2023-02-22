import type { UseQueryOptions } from 'react-query'
import { useQuery } from 'react-query'

import { ProfileRecord } from '@/utils/types'
import { useStore } from '../useStore'
import { Contract } from 'ethers'

type QueryOptions = Omit<
  UseQueryOptions<ProfileRecord, Error, ProfileRecord, string>,
  'queryKey' | 'queryFn'
>

const MAX_PROFILE_COUNT = 20

let learnNGrowContract: Contract

export default function useProfiles(options?: QueryOptions) {
  const { store } = useStore()
  const { learnNGrowContract: storeLearnNGrowContract } = store

  if (!storeLearnNGrowContract) return

  learnNGrowContract = storeLearnNGrowContract

  const enabled = options?.enabled !== false
  const queryOptions: QueryOptions = { ...(options || {}), enabled }

  return useQuery<ProfileRecord, Error, ProfileRecord, string>(
    'getAllProfiles',
    getAllProfiles,
    queryOptions
  )
}

async function getAllProfiles() {
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
