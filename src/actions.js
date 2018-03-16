import types from './actionTypes';

export const increment = () => ({
  type: types.INCREMENT
});

export const addDeckToShoe = () => ({
  type: types.ADD_DECK_TO_SHOE
});

export const addPlayer = () => ({
  type: types.ADD_PLAYER
});

export const drawCard = (playerId, faceUp = true) => ({
  type: types.DRAW_CARD, playerId, faceUp
});

export const setStartGame = started => ({
  type: types.SET_START_GAME, started
});

export const playerStayed = playerId => ({
  type: types.PLAYER_STAYED, playerId
});

export const startDealerPlay = () => ({
  type: types.START_DEALER_PLAY
});

export const dealerDone = () => ({
  type: types.DEALER_DONE
});
