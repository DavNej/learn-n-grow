import { useQuery, useQueryClient } from 'react-query'
import type { UseQueryOptions } from 'react-query'
import type { Contract } from 'ethers'

import { IPublication, ProfileRecord } from '@/utils/types'
import { useStore } from '../useStore'

type QueryOptions = Omit<
  UseQueryOptions<IPublication[], Error, IPublication[], string>,
  'queryKey' | 'queryFn'
>

export default function usePublications(options?: QueryOptions) {
  const { store } = useStore()
  const { learnNGrowContract } = store

  const queryClient = useQueryClient()
  const profilesById = queryClient.getQueryData<ProfileRecord>('getProfiles')

  const defaultOptions = {
    enabled: options?.enabled !== false && !!profilesById,
  }

  const queryOptions: QueryOptions = { ...defaultOptions, ...(options || {}) }

  return useQuery<IPublication[], Error, IPublication[], string>(
    'getPublications',
    getAllPublications(learnNGrowContract, profilesById),
    queryOptions
  )
}

function getAllPublications(
  learnNGrowContract: Contract | undefined,
  profilesById: ProfileRecord | undefined
) {
  return async function () {
    if (!profilesById) return []

    const profilesWithPublications = Object.values(profilesById).filter(
      p => !!p.pubCount
    )

    const publicationsByProfileId: Record<number, IPublication[]> = []

    for (let i = 0; i < profilesWithPublications.length; i++) {
      const { pubCount, id: profileId } = profilesWithPublications[i]
      const publications = await getProfilePublications(learnNGrowContract, {
        profileId,
        pubCount,
      })

      publicationsByProfileId[profileId] = publications
    }

    return Object.values(publicationsByProfileId).flat()
  }
}

async function getProfilePublications(
  learnNGrowContract: Contract | undefined,
  {
    pubCount,
    profileId,
  }: {
    pubCount: number
    profileId: number
  }
) {
  if (!learnNGrowContract) return []

  const publications: IPublication[] = []

  for (let pubId = 1; pubId <= pubCount; pubId++) {
    const pubTypeIndex = await learnNGrowContract.getPubType(profileId, pubId)
    const PUB_TYPES_ENUM = ['Post', 'Comment', 'Nonexistent']
    const pubType = PUB_TYPES_ENUM[pubTypeIndex]

    if (pubType === 'NonExistent') continue

    const contentURI = await learnNGrowContract.getContentURI(profileId, pubId)

    const common = { id: pubId, authorId: profileId, contentURI }

    if (pubType === 'Post') {
      publications.push({
        ...common,
        type: 'post',
      })
      continue
    }

    if (pubType === 'Comment') {
      const [profileIdPointed, pubIdPointed] =
        await learnNGrowContract.getPubPointer(profileId, pubId)

      publications.push({
        ...common,
        profileIdPointed: profileIdPointed.toNumber(),
        pubIdPointed: pubIdPointed.toNumber(),
        type: 'comment',
      })
      continue
    }
  }

  return publications
}
