import * as React from 'react'
import { useRouter } from 'next/router'

import { Text, Avatar, Box, Flex, Heading, Spinner } from '@chakra-ui/react'

import { useProfileToken } from '@/hooks/contracts/useTokenURI'
import Post from '@/components/Post'
import { filterPostComments } from './feed'
import {
  useProfiles,
  usePublications,
  usePubsContent,
} from '@/hooks/learn-n-grow'
import { isFullComment, isFullPost } from '@/utils/types'
import Link from 'next/link'
import { makeOpenSeaUrl } from '@/utils'

export default function Profile() {
  const { query, push } = useRouter()
  const { handle: handleParam } = query

  const { isLoading: isProfilesLoading, data: profilesById } = useProfiles()
  usePublications()
  const {
    isLoading: isPublicationsLoading,
    isSuccess,
    data: publications,
  } = usePubsContent()

  const handle = handleParam ? handleParam.toString() : ''
  const profile =
    profilesById && Object.values(profilesById).find(p => p.handle === handle)
  const profileId = profile?.id || 0

  const token = useProfileToken({ profileId })

  if (!profile) return null

  if (isProfilesLoading)
    return (
      <Flex justifyContent='center'>
        <Spinner />
      </Flex>
    )

  const profilePubs = publications?.filter(p => p.authorId === profileId) || []
  const posts = profilePubs.filter(isFullPost)
  const comments = publications?.filter(isFullComment) || []

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

      {isPublicationsLoading || !isSuccess ? (
        <Flex justifyContent='center'>
          <Spinner />
        </Flex>
      ) : posts.length > 0 ? (
        posts.map(post => (
          <Post
            key={post.id}
            post={post}
            profile={profile}
            comments={filterPostComments({ comments, post })}
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
          <Link target='_blank' href={makeOpenSeaUrl(profileId)}>
            <div dangerouslySetInnerHTML={{ __html: token.image }} />
          </Link>
        ) : (
          <Spinner />
        )}
      </Flex>
    </Box>
  )
}
