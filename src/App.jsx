import { useEffect, useReducer, useState } from 'react'
import { fetchPosts } from './api/postsApi.js'
import { initialState, postsReducer } from './reducer/postsReducer.js'
import PostList from './components/PostList.jsx'
import FilterForm from './components/FilterForm.jsx'

function App() {
  const [state, dispatch] = useReducer(postsReducer, initialState)
  const [filter, setFilter] = useState('')
  // Changing this number re-runs the fetch effect (used by the "Try again" button).
  const [reloadCount, setReloadCount] = useState(0)

  // Fetch on mount (and again when the user asks to retry). The AbortController cancels the request if the
  // component unmounts, so no state update happens after unmount.
  useEffect(() => {
    const controller = new AbortController()

    async function loadPosts() {
      dispatch({ type: 'FETCH_START' })
      try {
        const posts = await fetchPosts(controller.signal)
        dispatch({ type: 'FETCH_SUCCESS', payload: posts })
      } catch (err) {
        if (err.name === 'AbortError') return
        dispatch({ type: 'FETCH_ERROR', payload: err.message })
      }
    }

    loadPosts()

    return () => controller.abort()
  }, [reloadCount])

  // Derived during render: only the source posts are stored in state.
  const query = filter.trim().toLowerCase()
  const visiblePosts = state.posts.filter((post) => post.title.toLowerCase().includes(query))

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: 4 }}>Post Dashboard</h1>
      <p style={{ marginTop: 0, color: '#555' }}>Posts loaded from JSONPlaceholder</p>
      <FilterForm filter={filter} onFilterChange={setFilter} />
      {state.loading && <p>Loading posts...</p>}

      {!state.loading && state.error && (
        <div>
          <p style={{ color: 'crimson' }}>Could not load posts: {state.error}</p>
          <button type="button" onClick={() => setReloadCount((count) => count + 1)}>
            Try again
          </button>
        </div>
      )}

      {!state.loading && !state.error && visiblePosts.length === 0 && <p>No posts found.</p>}

      {!state.loading && !state.error && state.posts.length > 0 && (
        <p style={{ color: '#555' }}>
          Showing {visiblePosts.length} of {state.posts.length} posts
        </p>
      )}

      {!state.loading && !state.error && visiblePosts.length > 0 && <PostList posts={visiblePosts} />}
    </div>
  )
}

export default App
