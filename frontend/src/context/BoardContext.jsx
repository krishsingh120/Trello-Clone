// Stores board data and exposes context actions for lists, cards, and detail updates.
import { createContext, useContext, useEffect, useReducer } from 'react';
import { getBoard, searchBoard } from '../api/boards.api';
import { createList, deleteList, reorderLists, updateList } from '../api/lists.api';
import {
  addChecklistItem,
  addLabelToCard,
  assignMember,
  createCard,
  deleteCard,
  deleteChecklistItem,
  getCard,
  moveCard,
  removeLabelFromCard,
  reorderCards,
  toggleChecklistItem,
  unassignMember,
  updateCard,
} from '../api/cards.api';
import { getMembers } from '../api/members.api';

const BoardContext = createContext();

const initialState = {
  board: null,
  lists: [],
  cards: {},
  members: [],
  loading: true,
  error: null,
  activeCard: null,
  activeDrag: null,
  highlightedCardIds: [],
};

function mapBoardData(board) {
  const cardMap = {};
  (board.lists || []).forEach((list) => {
    cardMap[list.id] = list.cards || [];
  });

  return {
    board,
    lists: board.lists || [],
    cards: cardMap,
  };
}

function replaceCardInMap(cards, updatedCard) {
  const nextCards = { ...cards };
  Object.keys(nextCards).forEach((listId) => {
    nextCards[listId] = nextCards[listId].filter((card) => card.id !== updatedCard.id);
  });
  nextCards[updatedCard.listId] = [...(nextCards[updatedCard.listId] || []), updatedCard].sort(
    (a, b) => a.position - b.position
  );
  return nextCards;
}

function boardReducer(state, action) {
  switch (action.type) {
    case 'LOAD_BOARD':
      return { ...state, ...mapBoardData(action.payload), loading: false, error: null };
    case 'SET_MEMBERS':
      return { ...state, members: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_ACTIVE_CARD':
      return { ...state, activeCard: action.payload };
    case 'SET_ACTIVE_DRAG':
      return { ...state, activeDrag: action.payload };
    case 'SET_HIGHLIGHTED':
      return { ...state, highlightedCardIds: action.payload };
    case 'ADD_LIST':
      return { ...state, lists: [...state.lists, action.payload] };
    case 'UPDATE_LIST':
      return {
        ...state,
        lists: state.lists.map((list) => (list.id === action.payload.id ? action.payload : list)),
      };
    case 'DELETE_LIST': {
      const nextCards = { ...state.cards };
      delete nextCards[action.payload];
      return {
        ...state,
        lists: state.lists.filter((list) => list.id !== action.payload),
        cards: nextCards,
      };
    }
    case 'REORDER_LISTS':
      return { ...state, lists: action.payload };
    case 'ADD_CARD': {
      const key = action.payload.listId;
      return {
        ...state,
        cards: {
          ...state.cards,
          [key]: [...(state.cards[key] || []), action.payload].sort((a, b) => a.position - b.position),
        },
      };
    }
    case 'SET_CARDS':
      return { ...state, cards: action.payload };
    case 'UPDATE_CARD':
      return {
        ...state,
        cards: replaceCardInMap(state.cards, action.payload),
        activeCard: action.payload,
      };
    case 'DELETE_CARD': {
      const nextCards = {};
      Object.keys(state.cards).forEach((listId) => {
        nextCards[listId] = state.cards[listId].filter((card) => card.id !== action.payload);
      });
      return {
        ...state,
        cards: nextCards,
        activeCard: state.activeCard?.id === action.payload ? null : state.activeCard,
      };
    }
    default:
      return state;
  }
}

export function BoardProvider({ children }) {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  useEffect(() => {
    async function bootstrap() {
      try {
        const [boardResponse, memberResponse] = await Promise.all([getBoard(1), getMembers()]);
        dispatch({ type: 'LOAD_BOARD', payload: boardResponse.data });
        dispatch({ type: 'SET_MEMBERS', payload: memberResponse.data });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    }

    bootstrap();
  }, []);

  const setError = (message) => dispatch({ type: 'SET_ERROR', payload: message });
  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });
  const setActiveDrag = (payload) => dispatch({ type: 'SET_ACTIVE_DRAG', payload });

  const reloadBoard = async () => {
    const [boardResponse, memberResponse] = await Promise.all([getBoard(1), getMembers()]);
    dispatch({ type: 'LOAD_BOARD', payload: boardResponse.data });
    dispatch({ type: 'SET_MEMBERS', payload: memberResponse.data });
  };

  const loadCard = async (cardId) => {
    try {
      const response = await getCard(cardId);
      dispatch({ type: 'SET_ACTIVE_CARD', payload: response.data });
    } catch (error) {
      setError(error.message);
    }
  };

  const closeCardModal = () => dispatch({ type: 'SET_ACTIVE_CARD', payload: null });

  const createListAction = async (payload) => {
    try {
      const response = await createList(payload);
      dispatch({ type: 'ADD_LIST', payload: response.data });
      dispatch({
        type: 'SET_CARDS',
        payload: {
          ...state.cards,
          [response.data.id]: [],
        },
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const updateListAction = async (listId, payload) => {
    try {
      const response = await updateList(listId, payload);
      dispatch({ type: 'UPDATE_LIST', payload: response.data });
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteListAction = async (listId) => {
    try {
      await deleteList(listId);
      dispatch({ type: 'DELETE_LIST', payload: listId });
    } catch (error) {
      setError(error.message);
    }
  };

  const reorderListsAction = async (orderedLists) => {
    const previousLists = state.lists;
    dispatch({ type: 'REORDER_LISTS', payload: orderedLists });

    try {
      await reorderLists({ boardId: state.board.id, orderedIds: orderedLists.map((list) => list.id) });
    } catch (error) {
      dispatch({ type: 'REORDER_LISTS', payload: previousLists });
      setError(error.message);
    }
  };

  const createCardAction = async (payload) => {
    try {
      const response = await createCard(payload);
      dispatch({ type: 'ADD_CARD', payload: response.data });
    } catch (error) {
      setError(error.message);
    }
  };

  const updateCardAction = async (cardId, payload) => {
    try {
      const response = await updateCard(cardId, payload);
      dispatch({ type: 'UPDATE_CARD', payload: response.data });
      await reloadBoard();
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteCardAction = async (cardId) => {
    try {
      await deleteCard(cardId);
      dispatch({ type: 'DELETE_CARD', payload: cardId });
      dispatch({ type: 'SET_ACTIVE_CARD', payload: null });
      await reloadBoard();
    } catch (error) {
      setError(error.message);
    }
  };

  const reorderCardsAction = async (listId, orderedCards) => {
    const previousCards = state.cards;
    dispatch({
      type: 'SET_CARDS',
      payload: {
        ...state.cards,
        [listId]: orderedCards.map((card, index) => ({ ...card, position: index })),
      },
    });

    try {
      await reorderCards({ listId, orderedIds: orderedCards.map((card) => card.id) });
      await reloadBoard();
    } catch (error) {
      dispatch({ type: 'SET_CARDS', payload: previousCards });
      setError(error.message);
    }
  };

  const moveCardAction = async ({ cardId, sourceListId, targetListId, targetPosition, skipApi = false }) => {
    const previousCards = state.cards;
    const currentListId = Number(
      Object.keys(state.cards).find((listId) => (state.cards[listId] || []).some((card) => card.id === cardId))
    );
    const effectiveSourceListId = currentListId || sourceListId;

    if (!effectiveSourceListId) {
      return;
    }

    const sourceCards = [...(state.cards[effectiveSourceListId] || [])];
    const targetCards =
      effectiveSourceListId === targetListId ? sourceCards : [...(state.cards[targetListId] || [])];
    const movingCard = sourceCards.find((card) => card.id === cardId);

    if (!movingCard) {
      return;
    }

    const nextSource = sourceCards
      .filter((card) => card.id !== cardId)
      .map((card, index) => ({ ...card, position: index }));
    const nextTarget = [...(effectiveSourceListId === targetListId ? nextSource : targetCards)];
    nextTarget.splice(targetPosition, 0, { ...movingCard, listId: targetListId });
    const normalizedTarget = nextTarget.map((card, index) => ({ ...card, position: index }));

    dispatch({
      type: 'SET_CARDS',
      payload: {
        ...state.cards,
        [effectiveSourceListId]:
          effectiveSourceListId === targetListId ? normalizedTarget : nextSource,
        [targetListId]: normalizedTarget,
      },
    });

    if (skipApi) {
      return;
    }

    try {
      await moveCard({ cardId, targetListId, targetPosition });
      await reloadBoard();
    } catch (error) {
      dispatch({ type: 'SET_CARDS', payload: previousCards });
      setError(error.message);
    }
  };

  const searchCardsAction = async (params) => {
    const hasFilters = Object.values(params).some((value) => value);

    try {
      if (!hasFilters) {
        await reloadBoard();
        dispatch({ type: 'SET_HIGHLIGHTED', payload: [] });
        return;
      }

      const response = await searchBoard(1, params);
      dispatch({ type: 'LOAD_BOARD', payload: response.data });
      dispatch({
        type: 'SET_HIGHLIGHTED',
        payload: response.data.lists.flatMap((list) => list.cards.map((card) => card.id)),
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const mutateCardDetails = async (cardId, callback) => {
    try {
      await callback();
      await loadCard(cardId);
      await reloadBoard();
    } catch (error) {
      setError(error.message);
    }
  };

  const actions = {
    clearError,
    setActiveDrag,
    loadCard,
    closeCardModal,
    createList: createListAction,
    updateList: updateListAction,
    deleteList: deleteListAction,
    reorderLists: reorderListsAction,
    createCard: createCardAction,
    updateCard: updateCardAction,
    deleteCard: deleteCardAction,
    archiveCard: (cardId) => updateCardAction(cardId, { isArchived: true }),
    reorderCards: reorderCardsAction,
    moveCard: moveCardAction,
    searchCards: searchCardsAction,
    addLabel: (cardId, labelId) => mutateCardDetails(cardId, () => addLabelToCard(cardId, labelId)),
    removeLabel: (cardId, labelId) =>
      mutateCardDetails(cardId, () => removeLabelFromCard(cardId, labelId)),
    addChecklistItem: (cardId, payload) =>
      mutateCardDetails(cardId, () => addChecklistItem(cardId, payload)),
    toggleChecklistItem: (itemId, cardId) =>
      mutateCardDetails(cardId, () => toggleChecklistItem(itemId)),
    deleteChecklistItem: (itemId, cardId) =>
      mutateCardDetails(cardId, () => deleteChecklistItem(itemId)),
    assignMember: (cardId, memberId) => mutateCardDetails(cardId, () => assignMember(cardId, memberId)),
    unassignMember: (cardId, memberId) =>
      mutateCardDetails(cardId, () => unassignMember(cardId, memberId)),
  };

  return <BoardContext.Provider value={{ state, dispatch, actions }}>{children}</BoardContext.Provider>;
}

export function useBoard() {
  return useContext(BoardContext);
}
