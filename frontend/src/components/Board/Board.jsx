// Renders the board lists and wires the dnd-kit drag and drop lifecycle.
import { useState } from 'react';
import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import ListColumn from '../List/ListColumn';
import AddListForm from '../List/AddListForm';
import CardItem from '../Card/CardItem';
import { useBoard } from '../../context/BoardContext';

function findListIdByCardId(cardsMap, cardId) {
  return Number(
    Object.keys(cardsMap).find((listId) => (cardsMap[listId] || []).some((card) => card.id === cardId))
  );
}

export default function Board() {
  const { state, actions } = useBoard();
  const [preview, setPreview] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const listIds = state.lists.map((list) => `list-${list.id}`);

  const onDragStart = ({ active }) => {
    const [kind, rawId] = String(active.id).split('-');

    if (kind === 'list') {
      const list = state.lists.find((item) => item.id === Number(rawId));
      setPreview({ type: 'list', data: list });
      actions.setActiveDrag({ type: 'list', id: list?.id });
      return;
    }

    const cardId = Number(rawId);
    const listId = findListIdByCardId(state.cards, cardId);
    const card = (state.cards[listId] || []).find((item) => item.id === cardId);
    setPreview({ type: 'card', data: card });
    actions.setActiveDrag({ type: 'card', id: card?.id, sourceListId: listId });
  };

  const onDragOver = ({ active, over }) => {
    if (!over || !String(active.id).startsWith('card-')) {
      return;
    }

    const cardId = Number(String(active.id).replace('card-', ''));
    const sourceListId = state.activeDrag?.sourceListId || findListIdByCardId(state.cards, cardId);
    const overId = String(over.id);
    const targetListId = overId.startsWith('list-')
      ? Number(overId.replace('list-', ''))
      : findListIdByCardId(state.cards, Number(overId.replace('card-', '')));

    if (sourceListId && targetListId && sourceListId !== targetListId) {
      actions.moveCard({
        cardId,
        sourceListId,
        targetListId,
        targetPosition: overId.startsWith('card-')
          ? Math.max(
              (state.cards[targetListId] || []).findIndex(
                (card) => card.id === Number(overId.replace('card-', ''))
              ),
              0
            )
          : (state.cards[targetListId] || []).length,
        skipApi: true,
      });
    }
  };

  const onDragEnd = ({ active, over }) => {
    actions.setActiveDrag(null);
    if (!over) {
      setPreview(null);
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId.startsWith('list-') && overId.startsWith('list-')) {
      const oldIndex = state.lists.findIndex((list) => `list-${list.id}` === activeId);
      const newIndex = state.lists.findIndex((list) => `list-${list.id}` === overId);

      if (oldIndex !== newIndex) {
        const orderedLists = arrayMove(state.lists, oldIndex, newIndex).map((list, index) => ({
          ...list,
          position: index,
        }));
        actions.reorderLists(orderedLists);
      }
    }

    if (activeId.startsWith('card-')) {
      const cardId = Number(activeId.replace('card-', ''));
      const sourceListId = state.activeDrag?.sourceListId || findListIdByCardId(state.cards, cardId);

      if (overId.startsWith('card-')) {
        const targetCardId = Number(overId.replace('card-', ''));
        const targetListId = findListIdByCardId(state.cards, targetCardId);

        if (sourceListId === targetListId) {
          const cards = state.cards[sourceListId] || [];
          const oldIndex = cards.findIndex((card) => card.id === cardId);
          const newIndex = cards.findIndex((card) => card.id === targetCardId);

          if (oldIndex !== newIndex) {
            actions.reorderCards(sourceListId, arrayMove(cards, oldIndex, newIndex));
          }
        } else if (targetListId && sourceListId) {
          const targetCards = state.cards[targetListId] || [];
          const targetIndex = targetCards.findIndex((card) => card.id === targetCardId);
          actions.moveCard({ cardId, sourceListId, targetListId, targetPosition: targetIndex });
        }
      }

      if (overId.startsWith('list-')) {
        const targetListId = Number(overId.replace('list-', ''));
        if (sourceListId !== targetListId) {
          actions.moveCard({
            cardId,
            sourceListId,
            targetListId,
            targetPosition: (state.cards[targetListId] || []).length,
          });
        }
      }
    }

    setPreview(null);
  };

  if (state.loading) {
    return <div className="board-loading">Loading board...</div>;
  }

  return (
    <div className="board-view">
      {state.error ? (
        <div className="toast-banner" role="status" onClick={actions.clearError}>
          {state.error}
        </div>
      ) : null}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={listIds} strategy={horizontalListSortingStrategy}>
          <div className="list-row">
            {state.lists.map((list) => (
              <ListColumn key={list.id} list={list} cards={state.cards[list.id] || []} />
            ))}
            <AddListForm />
          </div>
        </SortableContext>
        <DragOverlay>
          {preview?.type === 'card' && preview.data ? <CardItem card={preview.data} isOverlay /> : null}
          {preview?.type === 'list' && preview.data ? (
            <div className="overlay-list">{preview.data.title}</div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
