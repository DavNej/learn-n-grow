import * as React from 'react'
import { useRouter } from 'next/router'

import { Box, Flex, Heading, Image } from '@chakra-ui/react'

import { useProfile } from '@/hooks/contracts/useProfile'
import { decodeImageDataURI, decodeJsonDataURI } from '@/utils/decode'

export default function Profile() {
  const {
    query: { handle },
  } = useRouter()

  const profileHandle = handle ? handle.toString() : null
  const profile = useProfile({ handle: profileHandle })

  if (!profile) return null

  const NFTJson = decodeJsonDataURI(profile.tokenURI)
  const image = decodeImageDataURI(NFTJson.image)

  return (
    <Box bg='white' p={4} borderRadius='xl'>
      {profile && (
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

            <div dangerouslySetInnerHTML={{ __html: image }} />
          </Flex>
        </Box>
      )}
    </Box>
  )
}
