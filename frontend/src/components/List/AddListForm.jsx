// Renders the inline form used to create a new list on the board.
import { useState } from 'react';
import { useBoard } from '../../context/BoardContext';

export default function AddListForm() {
  const { state, actions } = useBoard();
  const [title, setTitle] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim() || !state.board) {
      return;
    }

    actions.createList({ boardId: state.board.id, title: title.trim() });
    setTitle('');
  };

  return (
    <form className="add-list-form" onSubmit={handleSubmit}>
      <h3>Add another list</h3>
      <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Enter list title" />
      <button type="submit">Add list</button>
    </form>
  );
}
