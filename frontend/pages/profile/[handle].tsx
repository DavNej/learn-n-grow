import * as React from 'react'
import { useRouter } from 'next/router'

import { Avatar, Box, Flex, Heading, Spinner } from '@chakra-ui/react'

import { useStore } from '@/hooks/useStore'
import { useProfileToken } from '@/hooks/contracts/useTokenURI'
import Post from '@/components/Post'
import { usePostList } from '@/hooks/contracts/usePostList'

export default function Profile() {
  const { query } = useRouter()
  const { store } = useStore()
  const { postsByProfileId } = usePostList()

  const { handle: handleParam } = query
  const handle = handleParam ? handleParam.toString() : ''
  const profile = Object.values(store.profilesById).find(
    p => p.handle === handle
  )
  const profileId = profile?.id || 0
  const token = useProfileToken({ profileId })

  if (!profile) return null

  const posts = postsByProfileId[profileId]

  return (
    <Box bg='white' p={4} borderRadius='xl'>
      <Flex alignItems='center' justifyContent='space-between'>
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

      {posts &&
        posts.map(post => (
          <Post key={post.id} post={post} profile={profile} noBanner />
        ))}

      <Heading
        pb={2}
        mt={4}
        size='md'
        borderBottom='2px'
        borderColor='gray.400'>
        Profile NFT
      </Heading>

      <Box p={8}>
        {token ? (
          <div dangerouslySetInnerHTML={{ __html: token.image }} />
        ) : (
          <Spinner />
        )}
      </Box>
    </Box>
  )
}
