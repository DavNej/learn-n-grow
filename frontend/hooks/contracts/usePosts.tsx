import * as React from 'react'
import axios from 'axios'
import { IBasePublication, IPost, PostMap } from '@/utils/types'
import { useStore } from '../useStore'
import { replaceIpfsGateway } from '@/utils'

export function usePosts({ enabled }: { enabled: boolean }) {
  const { store, setStore } = useStore()
  const { publicationsByProfileId, learnNGrowContract, postsByProfileId } =
    store

  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    if (publicationsByProfileId.size > 0 && enabled) {
      getPosts()
    } else {
      setIsLoading(false)
    }
  }, [learnNGrowContract, publicationsByProfileId])

  async function getPosts() {
    if (!learnNGrowContract) return

    setIsLoading(true)

    const contentURIMap: Map<string, IBasePublication> = new Map()

    publicationsByProfileId.forEach((profilePubs, profileId) => {
      profilePubs.forEach(pub => {
        if (pub.type === 'post') {
          const contentURI = replaceIpfsGateway(pub.contentURI)
          contentURIMap.set(contentURI, {
            id: pub.id,
            authorId: profileId,
            contentURI,
          })
        }
      })
    })

    const uris = Array.from(contentURIMap.keys())

    Promise.all(uris.map(contentURI => axios.get(contentURI)))
      .then(responses => {
        const _postsByProfileId = new Map<number, PostMap>()

        responses.forEach(res => {
          if (!res.config.url) return
          const _post = contentURIMap.get(res.config.url)
          if (!_post) return

          const profilePosts =
            _postsByProfileId.get(_post.authorId) || new Map<number, IPost>()

          profilePosts.set(_post.id, {
            ..._post,
            ...res.data,
          })

          _postsByProfileId.set(_post.authorId, profilePosts)
        })

        setStore(s => ({ ...s, postsByProfileId: _postsByProfileId }))
        setIsLoading(false)
      })
      .catch(err => {
        console.error({ err })
      })
  }

  return { postsByProfileId, isLoading }
}
