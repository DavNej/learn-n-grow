import { useQuery, useQueryClient } from 'react-query'
import type { QueryFunctionContext, UseQueryOptions } from 'react-query'
import type { Contract } from 'ethers'

import { IPublication, ProfileRecord } from '@/utils/types'
import { useStore } from '../useStore'

type QueryOptions = Omit<
  UseQueryOptions<
    IPublication[],
    Error,
    IPublication[],
    [string, ProfileRecord]
  >,
  'queryKey' | 'queryFn'
>

let learnNGrowContract: Contract

export default function usePublications(options?: QueryOptions) {
  const queryClient = useQueryClient()
  const { store } = useStore()
  const { learnNGrowContract: storeLearnNGrowContract } = store

  if (!storeLearnNGrowContract) return
  learnNGrowContract = storeLearnNGrowContract

  const profilesById = queryClient.getQueryData<ProfileRecord>('getAllProfiles')
  if (!profilesById) return

  const defaultOptions = {
    initialData: [],
    enabled: options?.enabled !== false,
  }

  const queryOptions: QueryOptions = { ...defaultOptions, ...(options || {}) }

  return useQuery<
    IPublication[],
    Error,
    IPublication[],
    [string, ProfileRecord]
  >(['getAllPublications', profilesById], GETAllPublications, queryOptions)
}

async function GETAllPublications({
  queryKey,
}: QueryFunctionContext<[string, ProfileRecord]>) {
  const [, profilesById] = queryKey
  return getAllPublications(profilesById)
}

async function getAllPublications(profilesById: ProfileRecord) {
  const profilesWithPublications = Object.values(profilesById).filter(
    p => !!p.pubCount
  )

  const publicationsByProfileId: Record<number, IPublication[]> = {}

  for (let i = 0; i < profilesWithPublications.length; i++) {
    const { pubCount, id: profileId } = profilesWithPublications[i]
    const publications = await getProfilePublications({
      profileId,
      pubCount,
    })

    publicationsByProfileId[profileId] = publications
  }

  return Object.values(publicationsByProfileId)
}

async function getProfilePublications({
  pubCount,
  profileId,
}: {
  pubCount: number
  profileId: number
}) {
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
