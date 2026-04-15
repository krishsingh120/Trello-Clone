// Renders the main board screen with toolbar, board body, and card modal.
import { useEffect } from 'react';
import Board from '../components/Board/Board';
import CardModal from '../components/Card/CardModal';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import { useSearch } from '../context/SearchContext';
import { useBoard } from '../context/BoardContext';

export default function BoardPage() {
  const { state: searchState } = useSearch();
  const { state, actions } = useBoard();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      actions.searchCards(searchState);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchState]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Workspace</p>
          <h1>{state.board?.title || 'Board'}</h1>
        </div>
        <SearchBar />
      </header>
      <section className="toolbar">
        <FilterBar />
      </section>
      <Board />
      <CardModal />
    </div>
  );
}
