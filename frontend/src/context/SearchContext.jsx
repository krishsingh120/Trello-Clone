// Stores board search and filter values shared by search UI components.
import { createContext, useContext, useReducer } from 'react';

const SearchContext = createContext();

const initialState = {
  q: '',
  labelId: '',
  memberId: '',
  dueBefore: '',
};

function searchReducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, q: action.payload };
    case 'SET_FILTERS':
      return { ...state, ...action.payload };
    case 'RESET_FILTERS':
      return initialState;
    default:
      return state;
  }
}

export function SearchProvider({ children }) {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  const setSearch = (value) => dispatch({ type: 'SET_SEARCH', payload: value });
  const setFilters = (payload) => dispatch({ type: 'SET_FILTERS', payload });
  const resetFilters = () => dispatch({ type: 'RESET_FILTERS' });

  return (
    <SearchContext.Provider value={{ state, setSearch, setFilters, resetFilters }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
