import React from 'react'
import { Box, Flex, Heading, Image, Text } from '@chakra-ui/react'
import { IPostContent, IProfile } from '@/utils/types'

export default function Post({
  post,
  profile,
}: {
  post: IPostContent
  profile: IProfile
}) {
  const handle = `@${profile.handle}`

  return (
    <Box p={4} mb={4} bgColor='white' borderRadius='xl'>
      <Flex alignItems='center' justifyContent='space-between'>
        <Image
          borderRadius='full'
          boxSize='52px'
          src={profile.imageURI}
          alt={handle}
        />
        <Flex
          flexDirection='column'
          alignItems='stretch'
          justifyContent='space-between'>
          <Heading size='sm'>{handle}</Heading>
          <Text fontSize='xs'>{post.creationDate}</Text>
        </Flex>
      </Flex>
      <Text p={4} m={4} border='2px' borderColor='gray.100' borderRadius='md'>
        {post.content}
      </Text>
      {post.mediaURI && <Image src={post.mediaURI} />}
    </Box>
  )
}
