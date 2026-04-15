// Renders checklist items and add/toggle/delete actions for a card.
import { useState } from 'react';
import { useBoard } from '../../context/BoardContext';

export default function ChecklistSection({ card }) {
  const { actions } = useBoard();
  const [title, setTitle] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    actions.addChecklistItem(card.id, { title: title.trim() });
    setTitle('');
  };

  return (
    <section className="detail-panel">
      <h3>Checklist</h3>
      <div className="checklist-list">
        {(card.checklistItems || []).map((item) => (
          <label key={item.id} className="checklist-item">
            <input
              type="checkbox"
              checked={item.isComplete}
              onChange={() => actions.toggleChecklistItem(item.id, card.id)}
            />
            <span className={item.isComplete ? 'complete' : ''}>{item.title}</span>
            <button type="button" onClick={() => actions.deleteChecklistItem(item.id, card.id)}>
              Remove
            </button>
          </label>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="inline-form">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add checklist item"
        />
        <button type="submit">Add</button>
      </form>
    </section>
  );
}
