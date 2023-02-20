import React from 'react'
import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import { usePosts } from '@/hooks/contracts/usePosts'
import { useStore } from '@/hooks/useStore'
import Post from '@/components/Post'
import { usePublications } from '@/hooks/contracts/usePublications'
import { flatten } from '@/utils'
import { IPost } from '@/utils/types'
import { useComments } from '@/hooks/contracts/useComments'

export default function Feed() {
  usePublications()
  const { postsByProfileId, isLoading } = usePosts()
  const { comments } = useComments({ enabled: true })
  const { store } = useStore()
  const { profilesById } = store
  const posts: IPost[] = flatten(postsByProfileId)
  const hasPosts = posts.length > 0

  if (!isLoading)
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
      comments={comments.filter(c => c.pubIdPointed && post.id)}
    />
  ))
}
