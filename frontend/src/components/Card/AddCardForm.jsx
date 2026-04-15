// Renders the inline form used to add a new card inside a list.
import { useState } from 'react';
import { useBoard } from '../../context/BoardContext';

export default function AddCardForm({ listId }) {
  const { actions } = useBoard();
  const [title, setTitle] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    actions.createCard({ listId, title: title.trim() });
    setTitle('');
  };

  return (
    <form className="add-card-form" onSubmit={handleSubmit}>
      <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Add a card" />
      <button type="submit">Add card</button>
    </form>
  );
}
