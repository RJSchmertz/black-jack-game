import types from './actionTypes';
import { newDeck, newPlayer, evaluateHand } from './utils'
import { DealerId } from './constants'

const initialState = {
  gameStarted: false,
  dealerPlaying: false,
  cardsInShoe: [],
  players: [
    {
      name: 'Dealer',
      id: 0,
      hand: [],
      score: 0,
      handTotal: 0,
      stayed: false
    }
  ]
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_DECK_TO_SHOE:
      return { ...state, cardsInShoe: [...state.cardsInShoe, ...newDeck()]}

    case types.ADD_PLAYER:
      return { ...state, players: [...state.players, newPlayer()]}

    case types.DRAW_CARD: {
      const drawnCard = state.cardsInShoe.slice(0, 1)[0];
      drawnCard.faceUp = action.faceUp;
      const rest = state.cardsInShoe.slice(1);
      const players = state.players.map(player => {
        if (player.id !== action.playerId) return player;
        const playerHand = [ ...player.hand, drawnCard ];
        const { handTotal } = evaluateHand(playerHand);
        return { ...player, hand: playerHand, handTotal};
      });
      return {
        ...state,
        cardsInShoe: rest,
        players
      }
    }

    case types.PLAYER_STAYED: {
      const players = state.players.map(player => {
        if (player.id !== action.playerId) {

          return { ...player, hand: [] } ;
        }
        return { ...player, stayed: true };
      });
      const dealerPlaying = players.every(player => player.stayed || player.id === DealerId);

      return { ...state, players, dealerPlaying }
    }

    case types.DEALER_DONE:
      const players = state.players.map(player => {
        const hand = player.hand.map(card => ({ ...card, faceUp: true }))
        return { ...player, hand }
      })
      return { ...state, players, gameStarted: false, dealerPlaying: false }

    case types.SET_START_GAME:
      return { ...state, gameStarted: action.started }

    default:
      return state;
  }
};


