// Renders a sortable card preview used in lists and drag overlays.
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBoard } from '../../context/BoardContext';

export default function CardItem({ card, isOverlay = false }) {
  const { state, actions } = useBoard();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `card-${card.id}`,
  });

  const isHighlighted =
    state.highlightedCardIds.length === 0 || state.highlightedCardIds.includes(card.id);

  return (
    <article
      ref={isOverlay ? undefined : setNodeRef}
      style={
        isOverlay
          ? undefined
          : {
              transform: CSS.Transform.toString(transform),
              transition,
              opacity: isDragging ? 0.35 : isHighlighted ? 1 : 0.45,
            }
      }
      className={`card-item ${isHighlighted ? 'is-highlighted' : 'is-muted'}`}
      onClick={() => actions.loadCard(card.id)}
      {...(isOverlay ? {} : attributes)}
      {...(isOverlay ? {} : listeners)}
    >
      <div className="card-label-row">
        {(card.labels || []).map((cardLabel) => (
          <span
            key={cardLabel.label.id}
            className="label-chip"
            style={{ backgroundColor: cardLabel.label.color }}
            title={cardLabel.label.name}
          />
        ))}
      </div>
      <h4>{card.title}</h4>
      {card.description ? <p>{card.description}</p> : null}
      <div className="card-meta">
        <span>
          {(card.checklistItems || []).filter((item) => item.isComplete).length}/
          {(card.checklistItems || []).length} tasks
        </span>
        <div className="avatar-row">
          {(card.members || []).map((entry) => (
            <span
              key={entry.member.id}
              className="avatar-badge"
              style={{ backgroundColor: entry.member.avatarColor }}
              title={entry.member.name}
            >
              {entry.member.name.slice(0, 1)}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
