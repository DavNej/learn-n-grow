import * as React from 'react'
import axios from 'axios'
import { IComment, ICommentPublication } from '@/utils/types'
import { useStore } from '../useStore'

export function useComments({ enabled }: { enabled: boolean }) {
  const { store, setStore } = useStore()
  const { publicationsByProfileId, learnNGrowContract } = store

  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    if (publicationsByProfileId.size > 0 && enabled) {
      getComments()
    }
  }, [learnNGrowContract, publicationsByProfileId])

  async function getComments() {
    if (!learnNGrowContract) return

    setIsLoading(true)
    const _comments: IComment[] = []
    const contentURIMap: Map<string, ICommentPublication> = new Map()

    publicationsByProfileId.forEach((profilePubs, profileId) => {
      profilePubs.forEach(pub => {
        if (pub.type === 'comment') {
          contentURIMap.set(pub.contentURI, {
            id: pub.id,
            authorId: profileId,
            contentURI: pub.contentURI,
            profileIdPointed: pub.profileIdPointed,
            pubIdPointed: pub.pubIdPointed,
          })
        }
      })
    })

    const uris = Array.from(contentURIMap.keys())

    Promise.all(uris.map(contentURI => axios.get(contentURI)))
      .then(responses => {
        responses.forEach(res => {
          if (!res.config.url) return
          const _comment = contentURIMap.get(res.config.url)
          if (!_comment) return

          _comments.push({
            ..._comment,
            ...res.data,
          })
        })

        setStore(s => ({ ...s, comments: _comments }))
        setIsLoading(false)
      })

      .catch(err => {
        console.error({ err })
      })
  }

  return { isLoading }
}
