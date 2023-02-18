import * as React from 'react'
import { useRouter } from 'next/router'

import { Box, Flex, Heading, Image, Spinner } from '@chakra-ui/react'

import { useStore } from '@/hooks/useStore'
import { useProfileToken } from '@/hooks/contracts/useTokenURI'

export default function Profile() {
  const {
    query: { handle },
  } = useRouter()
  const { store } = useStore()

  const profileHandle = handle ? handle.toString() : ''
  const profile = store.profileList[profileHandle]

  const profileId = profile?.id || 0
  const token = useProfileToken({ profileId })

  if (!profile) return null

  return (
    <Box bg='white' p={4} borderRadius='xl'>
      <Box>
        <Flex alignItems='center'>
          <Image
            borderRadius='full'
            boxSize='150px'
            src={profile.imageURI}
            alt={`@${profile.handle}`}
          />
          <Heading ml={8} size='md'>
            @{profile.handle}
          </Heading>
        </Flex>
        <Flex p={8} flexDirection='column' alignItems='center'>
          <Heading ml={8} size='md'>
            Profile NFT
          </Heading>

          {token ? (
            <div dangerouslySetInnerHTML={{ __html: token.image }} />
          ) : (
            <Spinner />
          )}
        </Flex>
      </Box>
    </Box>
  )
}
