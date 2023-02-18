import { usePostList } from '@/hooks/contracts/usePostList'

export default function Feed() {
  const postsByUser = usePostList()
  const posts = Object.values(postsByUser).flat()

  return (
    <div>
      {posts.map(post => (
        <div>
          <a key={post.id} href={post.contentURI}>
            {post.authorId}
          </a>
        </div>
      ))}
    </div>
  )
}
