# Assignment 6 - Post Dashboard (React)

A small React app made with Vite. It loads posts from
`https://jsonplaceholder.typicode.com/posts`, shows loading / error / empty states,
and lets the user filter the posts by title. Async state is managed with `useReducer`.

## How to run

```bash
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

## File Organization

- `index.html`: the page with the `root` div and the script tag for `main.jsx`.
- `src/main.jsx`: mounts `<App />` into `#root`.
- `src/api/postsApi.js`: `fetchPosts(signal)`. Only data fetching: calls `fetch`, throws
  an error if the response is not OK (fetch does not reject on HTTP errors by itself),
  and returns the parsed JSON. No JSX and no React imports.
- `src/reducer/postsReducer.js`: `initialState` (`{ posts: [], loading: false, error: null }`)
  and the pure `postsReducer`, which handles `FETCH_START`, `FETCH_SUCCESS` and
  `FETCH_ERROR` by returning new objects (spread), never mutating the old state.
- `src/App.jsx`: owns the state and coordinates the children.
  - `useReducer(postsReducer, initialState)` for the async state.
  - `useEffect(..., [reloadCount])` fetches on mount (and on retry): dispatches `FETCH_START`, then
    `FETCH_SUCCESS` or `FETCH_ERROR` inside `try/catch`. The cleanup function aborts the
    request with an `AbortController`, so nothing is dispatched after unmount.
  - `useState('')` for the filter text. The filtered list (`visiblePosts`) is computed
    during render from `state.posts`; it is never stored in state.
  - Conditional rendering for "Loading posts...", the error message, "No posts found."
    and the list.
  - `reloadCount` (`useState(0)`) is in the effect's dependency array; the "Try again"
    button on the error message increases it, so the same effect fetches again.
  - Under the filter it shows "Showing X of Y posts", also derived during render.
  - `role="status"`, `role="alert"` and `aria-live` let screen readers announce the
    loading message, the error and the result count.
- `src/components/FilterForm.jsx`: a controlled input (`value` + `onChange`) for the
  title filter. The value lives in `App`. A "Clear" button appears when the filter is
  not empty and resets it to `''`.
- `src/components/PostList.jsx`: pure render component. Receives `posts` as props and
  renders one `Post` per item with `.map()`, using the post `id` as the key.
- `src/components/Post.jsx`: presentational component that shows `title` and `body`.

## Challenges

- Keeping the layers separate: the API file must not know about React, and the reducer
  must stay pure, so all the async work (and the dispatches) had to live in the effect
  in `App`.
- Cleanup: in development React StrictMode runs the effect twice, so the first request
  must be cancelled. Aborting it in the cleanup and ignoring the resulting `AbortError`
  avoids a fake error message and updates after unmount.
- `fetch` only rejects on network problems, so a 404/500 would look like success; checking
  `response.ok` and throwing makes those errors show up in the UI.
- Derived state: it was tempting to keep a `filteredPosts` state, but that duplicates data
  and can get out of sync. Filtering during render keeps only the source posts in state.
- Retrying without breaking the rules: the fetch must stay inside `useEffect`, so the
  button does not call `fetchPosts` itself. It only changes `reloadCount`, and the effect
  (with its cleanup) runs again.
- Showing the right message: the empty message has to depend on the filtered list, and
  only when we are not loading and there is no error.
