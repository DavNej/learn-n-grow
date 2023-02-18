import axios from 'axios'
import React from 'react'
import { Box, Text } from '@chakra-ui/react'
import { IPostContent } from '@/utils/types'
import { usePostList } from '@/hooks/contracts/usePostList'
import { useStore } from '@/hooks/useStore'
import Post from '@/components/Post'

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
      <Post
        key={post.creationDate}
        post={post}
        profile={profileList[post.authorId]}
      />
    ))
  ) : (
    <Box p={4} mb={4} bgColor='white' borderRadius='md'>
      <Text fontSize='md' textAlign='center'>
        No post to show 🤷
      </Text>
    </Box>
  )
}
