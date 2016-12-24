import { Map } from 'immutable'
import { addDeckCardValueListener } from './listeners'
import { setDeckCardValueListener } from 'helpers/firebase'

// actions
const SETTING_CARD_VALUE_LISTENER = 'SETTING_CARD_VALUE_LISTENER'
const SETTING_CARD_VALUE_LISTENER_SUCCESS = 'SETTING_CARD_VALUE_LISTENER_SUCCESS'
const SETTING_CARD_VALUE_LISTENER_FAILURE = 'SETTING_CARD_VALUE_LISTENER_FAILURE'

// thunks
export function setCardListeners(deckId, cardId) {
  return (dispatch, getState) => {
    const state = getState().listeners

    if (state.getIn(['deckCards', deckId, 'cards', cardId]) !== true) {
      dispatch(addDeckCardValueListener(deckId, cardId))
      dispatch(settingCardValueListener(cardId))
      setDeckCardValueListener(
        deckId, cardId,
        card => dispatch(settingCardValueListenerSuccess(cardId, card)),
        error => dispatch(settingCardValueListenerFailure(cardId, error)),
      )
    }
  }
}

// action creators
function settingCardValueListener(cardId) {
  return {
    type: SETTING_CARD_VALUE_LISTENER,
    cardId,
  }
}

function settingCardValueListenerSuccess(cardId, card) {
  return {
    type: SETTING_CARD_VALUE_LISTENER_SUCCESS,
    cardId,
    card,
  }
}

function settingCardValueListenerFailure(cardId, error) {
  return {
    type: SETTING_CARD_VALUE_LISTENER_FAILURE,
    cardId,
    error,
  }
}

// card reducer
const initialCardState = Map({
  isLoading: true,
  loadingError: '',

  cardId: '',
  side1: '',
  side2: '',
})

function card(state = initialCardState, action) {
  switch(action.type) {
    case SETTING_CARD_VALUE_LISTENER:
      return state
        .set('isLoading', true)
        .set('loadingError', '')
    case SETTING_CARD_VALUE_LISTENER_SUCCESS:
      // TODO: Can action.card be null?
      return state
        .set('isLoading', false)
        .set('loadingError', '')
        .merge(action.card)
    case SETTING_CARD_VALUE_LISTENER_FAILURE:
      return state
        .set('isLoading', false)
        .set('loadingError', action.error)
    default:
      return state
  }
}

// cards reducer
const initialState = Map({
  cards: Map(),
})

export default function cards(state = initialState, action) {
  switch(action.type) {
    case SETTING_CARD_VALUE_LISTENER:
    case SETTING_CARD_VALUE_LISTENER_SUCCESS:
    case SETTING_CARD_VALUE_LISTENER_FAILURE:
      const path = ['cards', action.cardId]
      return state.setIn(path, card(state.getIn(path), action))
    default:
      return state
  }
}