// Renders the debounced search input bound to the shared search context.
import { useSearch } from '../../context/SearchContext';

export default function SearchBar() {
  const { state, setSearch } = useSearch();

  return (
    <label className="search-bar">
      <span>Search cards</span>
      <input
        value={state.q}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Find cards by title"
      />
    </label>
  );
}
