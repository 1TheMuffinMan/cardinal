import 'babel-polyfill'
import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'
import sinon from 'sinon'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import * as reducers from 'redux/modules'
import {
  settingCardValueListener,
  settingCardValueListenerSuccess,
  settingCardValueListenerFailure,
  deletingCard,
  deletingCardSuccess,
  deletingCardFailure,
  dismissCardsSnackbar,
  updateCard,
  removeCard,
  cardsLogout,
  deleteAndHandleCard,
  setCardValueListener,
} from 'redux/modules/cards'

chai.use(sinonChai)

describe('cards redux module', function() {
  let store

  beforeEach(function() {
    const setStub = sinon.stub()
    const removeStub = sinon.stub()
    const onStub = sinon.stub()
    const offStub = sinon.stub()
    const pushStub = sinon.stub().returns({
      key: 'myKey',
      set: setStub,
    })
    const childStub = sinon.stub().returns({
      set: setStub,
      remove: removeStub,
      on: onStub,
      off: offStub,
    })
    const firebaseContext = {
      ref: {
        child: childStub
      }
    }
    store = createStore(
      combineReducers(reducers),
      applyMiddleware(thunk.withExtraArgument(firebaseContext))
    )
  })

  it('should exist', function() {
    expect(reducers.cards).to.exist
  })

  it('should initialize all properties', function() {
    const { cards } = store.getState()
    expect(cards).to.exist
    expect(cards.get('cards')).to.exist

    const snackbar = cards.get('snackbar')
    expect(snackbar).to.exist
    expect(snackbar.get('isActive')).to.be.false
    expect(snackbar.get('error')).to.equal('')
  })

  describe('action creators', function() {
    let card
    beforeEach(function() {
      store.dispatch(settingCardValueListener('myCardId'))

      card = store.getState().cards.getIn(['cards', 'myCardId'])
    })

    describe('settingCardValueListener', function() {
      it('should initialize empty card with specified id', function() {
        expect(card).to.exist
        expect(card.get('isDeleting')).to.be.false
        expect(card.get('loadingError')).to.equal('')
        expect(card.get('cardId')).to.equal('myCardId')
        expect(card.get('side1')).to.equal('')
        expect(card.get('side2')).to.equal('')
      })
    })

    describe('settingCardValueListenerSuccess', function() {
      let card
      beforeEach(function() {
        store.dispatch(settingCardValueListener('myCardId'))
        store.dispatch(settingCardValueListenerSuccess('myCardId', {
          cardId: 'myCardId',
          side1: 'mySideOne',
          side2: 'mySideTwo',
        }))

        card = store.getState().cards.getIn(['cards', 'myCardId'])
      })

      it('should initialize card with fetched values', function() {
        expect(card).to.exist
        expect(card.get('cardId')).to.equal('myCardId')
        expect(card.get('side1')).to.equal('mySideOne')
        expect(card.get('side2')).to.equal('mySideTwo')
      })
    })

    describe('settingCardValueListenerFailure', function() {
      let card
      beforeEach(function() {
        store.dispatch(settingCardValueListener('myCardId'))
        store.dispatch(settingCardValueListenerFailure('myCardId', 'myErrorMessage'))

        card = store.getState().cards.getIn(['cards', 'myCardId'])
      })

      it('should set the loading error message', function() {
        expect(card).to.exist
        expect(card.get('loadingError')).to.equal('myErrorMessage')
      })
    })

    describe('deletingCard', function() {
      let card
      beforeEach(function() {
        store.dispatch(settingCardValueListener('myCardId'))
        store.dispatch(settingCardValueListenerSuccess('myCardId', {
          cardId: 'myCardId',
          side1: 'mySideOne',
          side2: 'mySideTwo',
        }))
        store.dispatch(deletingCard('myCardId'))

        card = store.getState().cards.getIn(['cards', 'myCardId'])
      })

      it('should set the isDeleting flag', function() {
        expect(card).to.exist
        expect(card.get('isDeleting')).to.be.true
      })
    })

    describe('deletingCardSuccess', function() {
      let snackbar
      beforeEach(function() {
        store.dispatch(deletingCardFailure('myCardId', 'myErrorMessage'))
        store.dispatch(deletingCardSuccess('myCardId'))

        snackbar = store.getState().cards.get('snackbar')
      })

      it('should reset the snackbar', function() {
        expect(snackbar.get('isActive')).to.be.false
        expect(snackbar.get('error')).to.equal('')
      })
    })

    describe('deletingCardFailure', function() {
      beforeEach(function() {
        store.dispatch(deletingCardFailure('myCardId', 'myErrorMessage'))
      })

      it('should log the error in the card itself', function() {
        const card = store.getState().cards.getIn(['cards', 'myCardId'])

        expect(card.get('isDeleting')).to.be.false
        expect(card.get('deletingError')).to.equal('myErrorMessage')
      })

      it('should show the error in the snackbar', function() {
        const snackbar = store.getState().cards.get('snackbar')

        expect(snackbar.get('isActive')).to.be.true
        expect(snackbar.get('error')).to.equal('myErrorMessage')
      })
    })

    describe('dismissCardsSnackbar', function() {
      let snackbar
      beforeEach(function() {
        store.dispatch(deletingCardFailure('myCardId', 'myErrorMessage'))
        store.dispatch(dismissCardsSnackbar())

        snackbar = store.getState().cards.get('snackbar')
      })

      it('should hide the snackbar', function() {
        expect(snackbar.get('isActive')).to.be.false
      })

      it('should not reset the error message', function() {
        expect(snackbar.get('error')).to.equal('myErrorMessage')
      })
    })

    describe('updateCard', function() {
      let card
      beforeEach(function() {
        store.dispatch(settingCardValueListenerSuccess('myCardId', {
          cardId: 'myCardId',
          side1: 'mySideOne',
          side2: 'mySideTwo',
        }))
        store.dispatch(updateCard('myCardId', {
          side1: 'mySideOne2',
          side2: 'mySideTwo2',
        }))

        card = store.getState().cards.getIn(['cards', 'myCardId'])
      })

      it('should update any specified values', function() {
        expect(card.get('side1')).to.equal('mySideOne2')
        expect(card.get('side2')).to.equal('mySideTwo2')
      })

      it('should retain the old values for any unspecified fields', function() {
        expect(card.get('cardId')).to.equal('myCardId')
      })
    })

    describe('removeCard', function() {
      let card
      beforeEach(function() {
        store.dispatch(settingCardValueListenerSuccess('myCardId', {
          cardId: 'myCardId',
          side1: 'mySideOne',
          side2: 'mySideTwo',
        }))
        store.dispatch(removeCard('myCardId'))

        card = store.getState().cards.getIn(['cards', 'myCardId'])
      })

      it('should remove the card from collection of cards', function() {
        expect(card).to.not.exist
      })
    })

    describe('cardsLogout', function() {
      let cards
      beforeEach(function() {
        store.dispatch(settingCardValueListenerSuccess('myCardId', {
          cardId: 'myCardId',
          side1: 'mySideOne',
          side2: 'mySideTwo',
        }))
        store.dispatch(cardsLogout())

        cards = store.getState().cards
      })

      it('should reset state to the initial state', function() {
        expect(cards.get('cards')).to.exist
        expect(cards.get('cards').size).to.equal(0)

        const snackbar = cards.get('snackbar')
        expect(snackbar).to.exist
        expect(snackbar.get('isActive')).to.be.false
        expect(snackbar.get('error')).to.equal('')
      })
    })
  })

  describe('thunks', function() {
    describe('deleteAndHandleCard', function() {
      
    })

    describe('setCardValueListener', function() {
      
    })
  })
})