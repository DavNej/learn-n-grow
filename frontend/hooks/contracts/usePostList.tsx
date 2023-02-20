import * as React from 'react'
import axios from 'axios'
import { IPost, IProfileList } from '@/utils/types'
import { useStore } from '../useStore'

type PostMap = Map<number, IPost>

export function usePostList() {
  const [postsByProfileId, setPostsByProfileId] = React.useState<
    Record<string, IPost[]>
  >({})
  const { store, setStore } = useStore()
  const { profilesById, learnNGrowContract } = store

  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    if (Object.keys(profilesById).length > 0) {
    getPostList()
    }
  }, [learnNGrowContract, profilesById])

  async function getPostList() {
    if (!learnNGrowContract) return

    const publicationsByProfileId = new Map<number, PostMap>()
    const profileCount = Object.keys(profilesById).length

    setIsLoading(true)

    for (let i = 1; i <= profileCount; i++) {
      const { pubCount, id: profileId } = profilesById[i]

      if (!pubCount) continue

      const profilePosts: PostMap = new Map()

      for (let pubId = 1; pubId <= pubCount; pubId++) {
        const publication = await learnNGrowContract.getPub(profileId, pubId)
        const contentURI = publication.contentURI
        if (!contentURI) continue

        const profileIdPointed: number = publication.profileIdPointed.toNumber()
        const pubIdPointed: number = publication.pubIdPointed.toNumber()

        const isPost = !(profileIdPointed && pubIdPointed)

        const common = {
          id: pubId,
          authorId: profileId,
        }

        if (isPost) {
          axios.get(contentURI).then(res => {
          profilePosts.set(pubId, {
              ...res.data,
              ...common,
            contentURI,
          })
          })

          continue
        }

        const pointedProfilePubs = publicationsByProfileId.get(profileIdPointed)

        const pointedPub =
          pointedProfilePubs && pointedProfilePubs.get(pubIdPointed)

        if (!pointedPub) continue

        axios.get(contentURI).then(res => {
          const comment = {
            ...res.data,
            ...common,
            contentURI,
          }

          if (!!pointedPub.comments) {
            pointedPub.comments = [...pointedPub.comments, comment]
          } else {
            pointedPub.comments = [comment]
          }
        })
      }

      publicationsByProfileId.set(profileId, profilePosts)
    }

    const posts = formatPublicationsByProfileId(
      profilesById,
      publicationsByProfileId
    )

    setPostsByProfileId(posts)
    setStore(s => ({ ...s, postsByProfileId: posts }))

    setIsLoading(false)
  }

  return { postsByProfileId, isLoading }
}

function formatPublicationsByProfileId(
  profilesById: IProfileList,
  publicationsByProfileId: Map<number, PostMap>
) {
  const result = Object.keys(profilesById).reduce((acc, currProfileId) => {
    const posts = publicationsByProfileId.get(parseInt(currProfileId))
    if (!posts) return acc
    return { ...acc, [currProfileId]: Array.from(posts.values()) }
  }, {})

  return result
}
