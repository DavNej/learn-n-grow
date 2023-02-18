import axios from 'axios'
import React from 'react'
import { Box, Flex, Heading, Image, Text } from '@chakra-ui/react'
import { IPostContent, IProfile } from '@/utils/types'
import { usePostList } from '@/hooks/contracts/usePostList'
import { useStore } from '@/hooks/useStore'

export default function Feed() {
  const postsByUser = usePostList()
  const { store } = useStore()
  const [formattedPosts, setFormattedPosts] = React.useState<IPostContent[]>([])

  const { profileList } = store

  const rawPosts = Object.values(postsByUser).flat()
  const hasPosts = rawPosts.length > 0

  React.useEffect(() => {
    if (rawPosts.length > 0) {
      Promise.all(rawPosts.map(({ contentURI }) => axios.get(contentURI))).then(
        responses => {
          const posts = responses.map(res => ({
            ...rawPosts.find(p => p.contentURI === res.config.url),
            ...res.data,
          }))

          setFormattedPosts(posts)
        }
      )
    }
  }, [postsByUser])

  return hasPosts ? (
    formattedPosts.map(post => (
      <Post post={post} profile={profileList[post.authorId]} />
    ))
  ) : (
    <Box p={4} mb={4} bgColor='white' borderRadius='md'>
      <Text fontSize='md' textAlign='center'>
        No post to show 🤷
      </Text>
    </Box>
  )
}

function Post({ post, profile }: { post: IPostContent; profile: IProfile }) {
  const handle = `@${profile.handle}`

  return (
    <Box key={post.creationDate} p={4} mb={4} bgColor='white' borderRadius='xl'>
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
