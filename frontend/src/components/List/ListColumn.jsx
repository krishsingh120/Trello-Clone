// Renders a sortable list column and its vertically sortable cards.
import { useEffect, useState } from 'react';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CardItem from '../Card/CardItem';
import AddCardForm from '../Card/AddCardForm';
import { useBoard } from '../../context/BoardContext';

export default function ListColumn({ list, cards }) {
  const { actions } = useBoard();
  const [title, setTitle] = useState(list.title);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `list-${list.id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.55 : 1,
  };

  const cardIds = cards.map((card) => `card-${card.id}`);

  useEffect(() => {
    setTitle(list.title);
  }, [list.title]);

  const handleBlur = () => {
    if (title.trim() && title.trim() !== list.title) {
      actions.updateList(list.id, { title: title.trim() });
    } else {
      setTitle(list.title);
    }
  };

  return (
    <section ref={setNodeRef} style={style} className="list-column">
      <div className="list-header" {...attributes} {...listeners}>
        <input value={title} onChange={(event) => setTitle(event.target.value)} onBlur={handleBlur} />
        <button className="ghost-button" type="button" onClick={() => actions.deleteList(list.id)}>
          Delete
        </button>
      </div>
      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <div className="card-stack">
          {cards.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
      <AddCardForm listId={list.id} />
    </section>
  );
}
