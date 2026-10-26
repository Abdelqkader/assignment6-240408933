// Presentational only: no state, no effects.
function Post({ title, body }) {
  return (
    <article style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, marginBottom: 12 }}>
      <h3 style={{ margin: '0 0 8px' }}>{title}</h3>
      <p style={{ margin: 0 }}>{body}</p>
    </article>
  )
}

export default Post
