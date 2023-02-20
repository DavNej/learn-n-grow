import * as React from 'react'
import axios from 'axios'
import { IBasePublication, IPost } from '@/utils/types'
import { useStore } from '../useStore'

type PostMap = Map<number, IPost>

export function usePosts() {
  const [postsByProfileId, setPostsByProfileId] = React.useState<
    Map<number, PostMap>
  >(new Map())
  const { store, setStore } = useStore()
  const { publicationsByProfileId, learnNGrowContract } = store

  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    if (publicationsByProfileId.size > 0) {
      getPosts()
    } else {
      setIsLoading(false)
    }
  }, [learnNGrowContract, publicationsByProfileId])

  async function getPosts() {
    if (!learnNGrowContract) return

    setIsLoading(true)

    const _postsByProfileId = new Map<number, PostMap>()
    const contentURIMap: Map<string, IBasePublication> = new Map()

    publicationsByProfileId.forEach((profilePubs, profileId) => {
      profilePubs.forEach(pub => {
        if (pub.type === 'post') {
          contentURIMap.set(pub.contentURI, {
            id: pub.id,
            authorId: profileId,
            contentURI: pub.contentURI,
          })
        }
      })
    })

    const uris = Array.from(contentURIMap.keys())

    Promise.all(uris.map(contentURI => axios.get(contentURI)))
      .then(responses => {
        const _posts = new Map<number, IPost>()
        responses.forEach(res => {
          if (!res.config.url) return
          const _post = contentURIMap.get(res.config.url)
          if (!_post) return

          _posts.set(_post.id, {
            ..._post,
            ...res.data,
          })
          _postsByProfileId.set(_post.authorId, _posts)
        })

        setPostsByProfileId(_postsByProfileId)
        setStore(s => ({ ...s, postsByProfileId: _postsByProfileId }))

        setIsLoading(false)
      })
      .catch(err => {
        console.error({ err })
      })
  }

  return { postsByProfileId, isLoading }
}
