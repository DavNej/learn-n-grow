import * as React from 'react'
import { PublicationMap } from '@/utils/types'
import { useStore } from '../useStore'

const PUB_TYPES_ENUM = ['Post', 'Comment', 'Nonexistent']

export function usePublications({ enabled }: { enabled: boolean }) {
  const { store, setStore } = useStore()
  const { profilesById, learnNGrowContract, publicationsByProfileId } = store

  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    if (Object.keys(profilesById).length > 0 && enabled) {
      getPublications()
    }
  }, [learnNGrowContract, profilesById])

  async function getPublications() {
    if (!learnNGrowContract) return

    const _publicationsByProfileId = new Map<number, PublicationMap>()
    const profileCount = Object.keys(profilesById).length

    setIsLoading(true)

    for (let i = 1; i <= profileCount; i++) {
      const { pubCount, id: profileId } = profilesById[i]

      if (!pubCount) continue

      const profilePublications: PublicationMap = new Map()

      for (let pubId = 1; pubId <= pubCount; pubId++) {
        const contentURI = await learnNGrowContract.getContentURI(
          profileId,
          pubId
        )

        if (!contentURI) continue

        const pubTypeIndex = await learnNGrowContract.getPubType(
          profileId,
          pubId
        )
        const pubType = PUB_TYPES_ENUM[pubTypeIndex]

        if (pubType === 'NonExistent') continue

        if (pubType === 'Post') {
          profilePublications.set(pubId, {
            id: pubId,
            authorId: profileId,
            contentURI,
            type: 'post',
          })
          continue
        }

        if (pubType === 'Comment') {
          const [BN_profileIdPointed, BN_pubIdPointed] =
            await learnNGrowContract.getPubPointer(profileId, pubId)

          const profileIdPointed: number = BN_profileIdPointed.toNumber()
          const pubIdPointed: number = BN_pubIdPointed.toNumber()

          if (!profileIdPointed || !pubIdPointed) continue

          profilePublications.set(pubId, {
            id: pubId,
            authorId: profileId,
            contentURI,
            profileIdPointed,
            pubIdPointed,
            type: 'comment',
          })
          continue
        }
      }

      _publicationsByProfileId.set(profileId, profilePublications)
    }

    setStore(s => ({ ...s, publicationsByProfileId: _publicationsByProfileId }))

    setIsLoading(false)
  }

  return { publicationsByProfileId, isLoading }
}
