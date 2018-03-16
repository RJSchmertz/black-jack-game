

export const shuffle = cards => {
  var currentIndex = cards.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }

  return cards;
}

export const newDeck = () => {
  const suits = ['clubs', 'diamonds', 'spades', 'hearts'];
  const cards = [
      { rank: 'Ace', value: [ 1, 10 ] },
      { rank: '2', value: 2 },
      { rank: '3', value: 3 },
      { rank: '4', value: 4 },
      { rank: '5', value: 5 },
      { rank: '6', value: 6 },
      { rank: '7', value: 7 },
      { rank: '8', value: 8 },
      { rank: '9', value: 9 },
      { rank: '10', value: 10 },
      { rank: 'Jack', value: 10 },
      { rank: 'Queen', value: 10 },
      { rank: 'King', value: 10 }
  ];
  let deck = [];
  suits.forEach(suit => {
    cards.forEach(card => {
      deck.push({ suit, ...card });
    })
  })

  return shuffle(deck);
}

let playerId = 1;
export const newPlayer = () => {
  return {
    name: 'Player 1',
    id: playerId++,
    hand: [],
    score: 0,
    handTotal: 0,
    playing: true
  }
}

const BLACKJACK = 21;

export const cardIsAce = card => card.rank === 'Ace';

export const evaluateHand = hand => {
  if (!hand.length) return { handTotal: 0, busted: false };
  const nonAceCards = hand.filter(card => !cardIsAce(card));
  let total = nonAceCards.reduce((total, current) => total + current.value, 0)
  let numberOfAces = hand.length - nonAceCards.length;
  if (numberOfAces === 0) return { handTotal: total, busted: total > BLACKJACK };

  for (var count = 0; count < numberOfAces; count++) {
    const value = total > 10 ? 1 : 11;
    total += value;
  }
  return { handTotal: total, busted: total > BLACKJACK }
}
