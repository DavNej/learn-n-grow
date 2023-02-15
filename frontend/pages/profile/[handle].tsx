import * as React from 'react'
import { useRouter } from 'next/router'
import { Flex, Heading, Image } from '@chakra-ui/react'

import { useStore } from '@/hooks/useStore'

export default function Profile() {
  const {
    query: { handle },
  } = useRouter()

  const { store } = useStore()

  const profile = store[handle]

  return (
    <Flex alignItems='center' bg='white' p={4} borderRadius='xl'>
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
  )
}
