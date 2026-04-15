// Renders board label/member/date filters bound to the shared search context.
import { useBoard } from '../../context/BoardContext';
import { useSearch } from '../../context/SearchContext';

export default function FilterBar() {
  const { state: boardState } = useBoard();
  const { state, setFilters, resetFilters } = useSearch();

  return (
    <div className="filter-bar">
      <select value={state.labelId} onChange={(event) => setFilters({ labelId: event.target.value })}>
        <option value="">All labels</option>
        {(boardState.board?.labels || []).map((label) => (
          <option key={label.id} value={label.id}>
            {label.name}
          </option>
        ))}
      </select>
      <select value={state.memberId} onChange={(event) => setFilters({ memberId: event.target.value })}>
        <option value="">All members</option>
        {boardState.members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={state.dueBefore}
        onChange={(event) => setFilters({ dueBefore: event.target.value })}
      />
      <button className="ghost-button" type="button" onClick={resetFilters}>
        Reset
      </button>
    </div>
  );
}
