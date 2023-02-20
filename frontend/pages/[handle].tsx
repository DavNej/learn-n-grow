import * as React from 'react'
import { useRouter } from 'next/router'

import { Text, Avatar, Box, Flex, Heading, Spinner } from '@chakra-ui/react'

import { useStore } from '@/hooks/useStore'
import { useProfileToken } from '@/hooks/contracts/useTokenURI'
import Post from '@/components/Post'
import { usePosts } from '@/hooks/contracts/usePosts'
import { useComments } from '@/hooks/contracts/useComments'
import { usePublications } from '@/hooks/contracts/usePublications'

export default function Profile() {
  const { query } = useRouter()
  const { store } = useStore()
  usePublications()
  const { postsByProfileId } = usePosts()
  const { comments } = useComments({ enabled: true })

  const { handle: handleParam } = query
  const handle = handleParam ? handleParam.toString() : ''
  const profile = Object.values(store.profilesById).find(
    p => p.handle === handle
  )
  const profileId = profile?.id || 0
  const token = useProfileToken({ profileId })

  if (!profile) return null

  const profilePosts = postsByProfileId.get(profileId)
  const posts = profilePosts && Array.from(profilePosts.values())

  return (
    <Box bg='white' p={4} borderRadius='xl'>
      <Flex mb={10} alignItems='center' justifyContent='space-between'>
        <Avatar
          mr={4}
          name={profile.handle}
          src={profile.imageURI}
          size='2xl'
        />
        <Heading ml={8} size='md'>
          @{profile.handle}
        </Heading>
      </Flex>
      <Heading
        pb={2}
        my={4}
        size='md'
        borderBottom='2px'
        borderColor='gray.400'>
        Posts
      </Heading>

      {posts ? (
        posts.map(post => (
          <Post
            comments={comments.filter(c => c.pubIdPointed && post.id)}
            key={post.id}
            post={post}
            profile={profile}
            noBanner
          />
        ))
      ) : (
        <Text textAlign='center'>No posts</Text>
      )}

      <Heading
        pb={2}
        mt={10}
        size='md'
        borderBottom='2px'
        borderColor='gray.400'>
        Profile NFT
      </Heading>

      <Flex p={8} justifyContent='center'>
        {token ? (
          <div dangerouslySetInnerHTML={{ __html: token.image }} />
        ) : (
          <Spinner />
        )}
      </Flex>
    </Box>
  )
}
