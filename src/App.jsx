import { useEffect, useReducer } from 'react'
import { fetchPosts } from './api/postsApi.js'
import { initialState, postsReducer } from './reducer/postsReducer.js'
import PostList from './components/PostList.jsx'

function App() {
  const [state, dispatch] = useReducer(postsReducer, initialState)

  // Fetch once on mount. The AbortController cancels the request if the
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
  }, [])

  return (
    <div>
      <h1>Post Dashboard</h1>
      <PostList posts={state.posts} />
    </div>
  )
}

export default App
