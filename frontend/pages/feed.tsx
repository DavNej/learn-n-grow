import React from 'react'
import { Box, Spinner, Text } from '@chakra-ui/react'
import { usePostList } from '@/hooks/contracts/usePostList'
import { useStore } from '@/hooks/useStore'
import Post from '@/components/Post'

export default function Feed() {
  const { postsByProfileId, isLoading } = usePostList()
  const { store } = useStore()

  const { profilesById } = store

  const allPosts = Object.values(postsByProfileId).flat()
  const hasPosts = allPosts.length > 0

  if (isLoading) return <Spinner />

  return hasPosts ? (
    allPosts.map(post => (
      <Post
        key={`${post.authorId}-${post.id}`}
        post={post}
        profile={profilesById[post.authorId]}
      />
    ))
  ) : (
    <Box p={4} mb={4} bgColor='white' borderRadius='md'>
      <Text fontSize='md' textAlign='center'>
        No post to show 🤷
      </Text>
    </Box>
  )
}
