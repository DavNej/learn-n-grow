import React from 'react'
import { Avatar, Box, Flex, Heading, Image, Link, Text } from '@chakra-ui/react'
import { IComment, IPost, IProfile } from '@/utils/types'
import { formatTimestamp } from '@/utils/format'
import { useStore } from '@/hooks/useStore'

export default function Post({
  post,
  comments,
  profile,
  noBanner,
}: {
  post: IPost
  comments: IComment[]
  profile: IProfile
  noBanner?: boolean
}) {
  const handle = `@${profile.handle}`

  const date = post.creationDate && formatTimestamp(post.creationDate)

  const { store } = useStore()
  const { profilesById } = store

  return (
    <Box
      p={4}
      mb={4}
      bgColor='white'
      borderRadius='xl'
      border='1px'
      borderColor='gray.400'>
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
      <Text p={4} my={4} border='2px' borderColor='gray.100' borderRadius='md'>
        {post.content}
      </Text>

      {post.mediaURI && <Image src={post.mediaURI} />}

      <Box bgColor='green.100'>
        {comments.map(comment => (
          <Box key={comment.id} mt={4}>
            <Flex alignItems='center' justifyContent='space-between'>
              <Link href={`/profile/${profilesById[comment.authorId]?.handle}`}>
                @{profilesById[comment.authorId]?.handle}
              </Link>
              <Text>{formatTimestamp(comment.creationDate)}</Text>
            </Flex>
            <Text>{comment.content}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
