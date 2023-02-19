import React from 'react'
import { Avatar, Box, Flex, Heading, Image, Link, Text } from '@chakra-ui/react'
import { IPostContent, IProfile } from '@/utils/types'
import { formatTimestamp } from '@/utils/format'

export default function Post({
  post,
  profile,
  noBanner,
}: {
  post: IPostContent
  profile: IProfile
  noBanner?: boolean
}) {
  const handle = `@${profile.handle}`

  const date = post.creationDate && formatTimestamp(post.creationDate)

  return (
    <Box p={4} mb={4} bgColor='white' borderRadius='xl'>
      <Flex alignItems='center' justifyContent='space-between'>
        {!noBanner && (
          <Link href={`/profile/${profile.handle}`}>
            <Avatar mr={4} name={profile.handle} src={profile.imageURI} />
          </Link>
        )}
        <Flex
          flexDirection='column'
          alignItems='stretch'
          justifyContent='space-between'>
          {!noBanner && <Heading size='sm'>{handle}</Heading>}
          <Text fontSize='xs'>{date}</Text>
        </Flex>
      </Flex>
      <Text
        p={4}
        m={4}
        mb={0}
        border='2px'
        borderColor='gray.100'
        borderRadius='md'>
        {post.content}
      </Text>
      {post.mediaURI && <Image p={4} src={post.mediaURI} />}
    </Box>
  )
}
