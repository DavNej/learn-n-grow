import * as React from 'react'

import { IPost, IProfileList } from '@/utils/types'
import { useStore } from '../useStore'

type PostMap = Map<number, IPost>

export function usePostList() {
  const [posts, setposts] = React.useState<Record<string, IPost[]>>({})
  const { store, setStore } = useStore()
  const { profileList, learnNGrowContract } = store

  React.useEffect(() => {
    getPostList()
  }, [learnNGrowContract, profileList])

  async function getPostList() {
    if (!learnNGrowContract) return

    const profiles = Object.values(profileList)

    const publicationsByProfileId = new Map<number, PostMap>()

    for (let i = 1; i < profiles.length; i++) {
      const { pubCount, id: profileId } = profiles[i]
      if (!pubCount) continue

      const profilePosts: PostMap = new Map()

      for (let pubId = 1; pubId <= pubCount; pubId++) {
        const publication = await learnNGrowContract.getPub(profileId, pubId)
        const contentURI = publication.contentURI
        if (!contentURI) continue

        const profileIdPointed: number = publication.profileIdPointed.toNumber()
        const pubIdPointed: number = publication.pubIdPointed.toNumber()

        const isPost = !(profileIdPointed && pubIdPointed)

        if (isPost) {
          profilePosts.set(pubId, {
            id: pubId,
            contentURI,
            authorId: profileId,
          })
          continue
        }

        const pointedProfilePubs = publicationsByProfileId.get(profileIdPointed)
        const pointedPub =
          pointedProfilePubs && pointedProfilePubs.get(profileIdPointed)

        if (!!pointedPub) {
          if (!!pointedPub.comments) {
            pointedPub.comments = [...pointedPub.comments, { contentURI }]
          } else {
            pointedPub.comments = [{ contentURI }]
          }
        }
      }

      publicationsByProfileId.set(profileId, profilePosts)
    }

    const publications = formatPublicationsByProfileId(
      profileList,
      publicationsByProfileId
    )

    setposts(publications)
    setStore(s => ({ ...s, posts: publications }))
  }

  return posts
}

function formatPublicationsByProfileId(
  profileList: IProfileList,
  publicationsByProfileId: Map<number, PostMap>
) {
  const result = Object.keys(profileList).reduce((acc, currProfileId) => {
    const posts = publicationsByProfileId.get(parseInt(currProfileId))
    if (!posts) return acc
    return { ...acc, [currProfileId]: Array.from(posts.values()) }
  }, {})

  return result
}
