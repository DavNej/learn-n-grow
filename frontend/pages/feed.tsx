import { usePostList } from '@/hooks/contracts/usePostList'

export default function Feed() {
  const postsByUser = usePostList()
  const posts = Object.values(postsByUser).flat()

  return (
    <div>
      {posts.map(post => (
        <div key={`${post.authorId}-${post.id}`}>
          <a href={post.contentURI}>{post.authorId}</a>
        </div>
      ))}
    </div>
  )
}
