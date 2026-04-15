// Renders the due date control for the active card.
import { useBoard } from '../../context/BoardContext';

export default function DueDatePicker({ card }) {
  const { actions } = useBoard();
  const value = card.dueDate ? new Date(card.dueDate).toISOString().slice(0, 10) : '';

  return (
    <section className="detail-panel">
      <h3>Due date</h3>
      <input
        type="date"
        value={value}
        onChange={(event) => actions.updateCard(card.id, { dueDate: event.target.value || null })}
      />
    </section>
  );
}
