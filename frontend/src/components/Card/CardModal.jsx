// Renders the portal-based card detail modal with edit and detail sections.
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import LabelPicker from '../CardDetail/LabelPicker';
import ChecklistSection from '../CardDetail/ChecklistSection';
import MemberAssign from '../CardDetail/MemberAssign';
import DueDatePicker from '../CardDetail/DueDatePicker';
import { useBoard } from '../../context/BoardContext';

export default function CardModal() {
  const { state, actions } = useBoard();
  const card = state.activeCard;
  const [draft, setDraft] = useState({ title: '', description: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (card) {
      setDraft({
        title: card.title || '',
        description: card.description || '',
      });
    }
  }, [card]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        actions.closeCardModal();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [actions]);

  if (!card) {
    return null;
  }

  const handlePersist = async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    await actions.updateCard(card.id, draft);
    setIsSaving(false);
  };

  return createPortal(
    <div className="modal-backdrop" onClick={actions.closeCardModal}>
      <div className="card-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-main">
          <input
            className="modal-title"
            value={draft.title}
            onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
            onBlur={handlePersist}
          />
          <textarea
            className="modal-description"
            value={draft.description}
            onChange={(event) =>
              setDraft((current) => ({ ...current, description: event.target.value }))
            }
            onBlur={handlePersist}
            placeholder="Add a more detailed description..."
          />
          <ChecklistSection card={card} />
        </div>
        <aside className="modal-sidebar">
          <section className="detail-panel">
            <h3>Actions</h3>
            <button className="ghost-button" type="button" onClick={handlePersist}>
              Save changes
            </button>
            <button className="ghost-button" type="button" onClick={() => actions.archiveCard(card.id)}>
              Archive card
            </button>
          </section>
          <DueDatePicker card={card} />
          <LabelPicker card={card} />
          <MemberAssign card={card} />
          <button className="danger-button" type="button" onClick={() => actions.deleteCard(card.id)}>
            Delete card
          </button>
        </aside>
      </div>
    </div>,
    document.body
  );
}
