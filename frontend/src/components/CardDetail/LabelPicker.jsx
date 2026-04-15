// Renders board labels and lets the user attach or remove them from a card.
import { useBoard } from '../../context/BoardContext';

export default function LabelPicker({ card }) {
  const { state, actions } = useBoard();
  const activeLabelIds = (card.labels || []).map((entry) => entry.label.id);

  return (
    <section className="detail-panel">
      <h3>Labels</h3>
      <div className="picker-grid">
        {(state.board?.labels || []).map((label) => {
          const isActive = activeLabelIds.includes(label.id);
          return (
            <button
              key={label.id}
              type="button"
              className={`picker-chip ${isActive ? 'active' : ''}`}
              style={{ borderColor: label.color }}
              onClick={() =>
                isActive ? actions.removeLabel(card.id, label.id) : actions.addLabel(card.id, label.id)
              }
            >
              <span className="label-swatch" style={{ backgroundColor: label.color }} />
              {label.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}
