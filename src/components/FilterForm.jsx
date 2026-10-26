// Controlled input: the value lives in App, this component only shows it and reports changes.
function FilterForm({ filter, onFilterChange }) {
  return (
    <form onSubmit={(e) => e.preventDefault()} style={{ marginBottom: 16 }}>
      <label>
        Filter by title:{' '}
        <input
          type="text"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          placeholder="Type part of a title"
        />
      </label>
    </form>
  )
}

export default FilterForm
