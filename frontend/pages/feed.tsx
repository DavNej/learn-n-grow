import React from 'react'
import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import Post from '@/components/Post'

import { usePublications } from '@/hooks/contracts/usePublications'
import { useComments } from '@/hooks/contracts/useComments'
import { usePosts } from '@/hooks/contracts/usePosts'
import { useStore } from '@/hooks/useStore'

import { flatten } from '@/utils'
import { IComment, IPost } from '@/utils/types'

export function filterComments({
  comments,
  post,
}: {
  comments: IComment[]
  post: IPost
}) {
  return comments.filter(
    c => c.pubIdPointed === post.id && c.profileIdPointed === post.authorId
  )
}

export default function Feed() {
  const { isLoading: isPublicationsLoading } = usePublications({
    enabled: true,
  })
  useComments({ enabled: true })
  const { isLoading: isPostsLoading } = usePosts({ enabled: true })
  const { store } = useStore()
  const { profilesById, postsByProfileId, comments } = store

  const posts: IPost[] = flatten(postsByProfileId)
  const hasPosts = posts.length > 0

  if (isPublicationsLoading || isPostsLoading)
    return (
      <Flex justifyContent='center'>
        <Spinner />
      </Flex>
    )

  if (!hasPosts)
    return (
      <Box p={4} bgColor='white' borderRadius='md'>
        <Text fontSize='md' textAlign='center'>
          No post to show 🤷
        </Text>
      </Box>
    )

  return posts.map(post => (
    <Post
      key={`${post.authorId}-${post.id}`}
      post={post}
      profile={profilesById[post.authorId]}
      comments={filterComments({ comments, post })}
    />
  ))
}
