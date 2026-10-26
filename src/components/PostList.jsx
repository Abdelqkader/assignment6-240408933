import Post from './Post.jsx'

// Pure render component: gets the posts as props and renders one Post per item.
function PostList({ posts }) {
  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} title={post.title} body={post.body} />
      ))}
    </div>
  )
}

export default PostList
