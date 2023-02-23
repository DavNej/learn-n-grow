import axios from 'axios'
import { useQuery, useQueryClient } from 'react-query'
import type { UseQueryOptions } from 'react-query'

import {
  IFullPublication,
  IPublication,
  IPublicationContent,
} from '@/utils/types'
import { cidFromUrl, urlFromCid } from '@/utils'
import { decodeDataUriToJson } from '@/utils/dataUri'

type QueryOptions = Omit<
  UseQueryOptions<IFullPublication[], Error, IFullPublication[], string>,
  'queryKey' | 'queryFn'
>

export default function usePubsContent(options?: QueryOptions) {
  const queryClient = useQueryClient()
  const publications =
    queryClient.getQueryData<IPublication[]>('getPublications')

  const defaultOptions = {
    enabled: options?.enabled !== false && !!publications,
  }

  const queryOptions: QueryOptions = { ...defaultOptions, ...(options || {}) }

  return useQuery<IFullPublication[], Error, IFullPublication[], string>(
    'getPubsContent',
    getPubsContent(publications),
    queryOptions
  )
}

function getPubsContent(publications: IPublication[] | undefined) {
  return async function () {
    if (!publications) return []

    let publicationsWithContent: IFullPublication[] = []

    const pubsByCid: Record<string, IPublication> = publications.reduce(
      (acc, currPub) => ({ ...acc, [currPub.contentURI]: currPub }),
      {}
    )

    const cids = Object.keys(pubsByCid)

    const responses = await Promise.all(
      cids.map(contentURI => axios.get(urlFromCid(contentURI)))
    )

    responses.forEach(res => {
      const cid = (res.config.url && cidFromUrl(res.config.url)) || ''
      const pub: IPublication = pubsByCid[cid]
      if (!pub) return
      const content = decodeDataUriToJson(res.data)
      if (!content) return
      const pubContent = content as IPublicationContent
      publicationsWithContent.push({
        ...pub,
        ...pubContent,
      })
    })

    return publicationsWithContent
  }
}
