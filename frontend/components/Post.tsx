import React from 'react'
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Link,
  Text,
} from '@chakra-ui/react'
import { IComment, IPost, IProfile } from '@/utils/types'
import { formatTimestamp } from '@/utils/format'
import NewComment from './NewComment'
import Comments from './Comments'

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

  const [showNewComment, setShowNewComment] = React.useState(false)

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
          <Link href={'/' + profile.handle}>
            <Avatar mr={4} name={profile.handle} src={profile.imageURI} />
          </Link>
        )}
        <Flex
          flexDirection='column'
          alignItems='stretch'
          justifyContent='space-between'>
          {!noBanner && (
            <Link href={'/' + profile.handle}>
              <Heading size='sm'>{handle}</Heading>
            </Link>
          )}
          <Text fontSize='xs'>{date}</Text>
        </Flex>
      </Flex>

      <Text p={4} my={4} border='1px' borderColor='gray.200' borderRadius='md'>
        {post.content}
      </Text>

      {post.mediaURI && <Image src={post.mediaURI} />}

      <Flex justifyContent='center'>
        <Button
          size='xs'
          onClick={() => {
            setShowNewComment(true)
          }}>
          Add comment
        </Button>
      </Flex>

      <Comments comments={comments} />

      <NewComment
        profileIdPointed={profile.id}
        pubIdPointed={post.id}
        isOpen={showNewComment}
        onClose={() => setShowNewComment(false)}
      />
    </Box>
  )
}
