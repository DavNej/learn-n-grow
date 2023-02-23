import React from 'react'
import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import Post from '@/components/Post'

import {
  useProfiles,
  usePublications,
  usePubsContent,
} from '@/hooks/learn-n-grow'

import {
  IFullComment,
  IFullPost,
  isFullComment,
  isFullPost,
} from '@/utils/types'

export function filterPostComments({
  comments,
  post,
}: {
  comments: IFullComment[]
  post: IFullPost
}) {
  return comments.filter(
    c => c.pubIdPointed === post.id && c.profileIdPointed === post.authorId
  )
}

export default function Food() {
  const { isLoading: isProfilesLoading, data: profilesById } = useProfiles()
  usePublications()
  const {
    isLoading: isPublicationsLoading,
    isSuccess,
    data: publications,
  } = usePubsContent()

  const isLoading = isProfilesLoading && isPublicationsLoading

  if (isLoading)
    return (
      <Flex justifyContent='center'>
        <Spinner />
      </Flex>
    )

  const posts = publications?.filter(isFullPost) || []
  const comments = publications?.filter(isFullComment) || []

  const hasPosts = posts.length > 0

  if (!hasPosts && isSuccess)
    return (
      <Box p={4} bgColor='white' borderRadius='md'>
        <Text fontSize='md' textAlign='center'>
          No post to show 🤷
        </Text>
      </Box>
    )

  return posts.map(post =>
    profilesById ? (
      <Post
        key={`${post.authorId}-${post.id}`}
        post={post}
        profile={profilesById[post.authorId]}
        comments={filterPostComments({ comments, post })}
      />
    ) : null
  )
}
