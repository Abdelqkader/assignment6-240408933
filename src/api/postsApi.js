// Data layer only: no JSX, no React imports.
const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts'

export async function fetchPosts(signal) {
  const response = await fetch(POSTS_URL, { signal })

  // fetch only rejects on network errors, so HTTP errors are checked here
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json()
}
