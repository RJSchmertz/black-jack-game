import React, { Component } from 'react';
import './App.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import { DealerId } from './constants';
import { evaluateHand } from './utils';

class App extends Component {
  componentWillMount() {
    this.props.actions.addDeckToShoe();
    this.props.actions.addPlayer();
  }

  componentWillReceiveProps(nextProps) {
    const humanPlayers = nextProps.players.filter(player => player.id !== DealerId)
    if (humanPlayers && humanPlayers.every(player => player.stayed)) {
      actions.startDealerPlay();
    }
    if (nextProps.gameStarted && nextProps.dealerPlaying && this.dealerShouldHit()) {
      if (this.dealerShouldHit()) {
        this.drawCard(this.getDealer().id)
      } else {
        this.props.actions.dealerDone();
        this.props.actions.setStartGame(false);
      }
    }
  }

  getPlayers = () => {
    const { players, gameStarted } = this.props;
    if (!players) return null;

    const playerMap = players.map(player => {
      const { handTotal, busted } = evaluateHand(player.hand);
      // const playButtonsActive = player.playing && gameStarted && !busted
      const playButtonsActive = gameStarted && !player.stayed && !busted
      const shouldDisplayTotal = player.hand.every(card => card.faceUp);

      return (
        <div key={player.name} className="player-container">
          <div>{player.name}</div>
          <div>Hand: {this.getRenderedHand(player)}</div>
          <div>Total: {shouldDisplayTotal ? handTotal : '--'}</div>
          {busted &&
            <div>BUSTED!</div>
          }

          {player.id !== DealerId &&
            <div>
              <button
                onClick={() => this.drawCard(player.id)}
                disabled={!playButtonsActive}>
                  Hit
              </button>
              <button
                onClick={() => this.stay(player.id)}
                disabled={!playButtonsActive}>
                  Stay
              </button>
            </div>
          }
        </div>

      );
    });
    return <div>{playerMap}</div>
  }

  getDealer = (props = this.props)  => {
    return props.players.filter(player => player.id === DealerId)[0]
  }

  get humanPlayers() {
    return this.props.players.filter(player => player.id !== DealerId)
  }

  dealerShouldHit = () => {
    const humanPlayers = this.props.players
    const { handTotal: dealerHandTotal, busted: dealerBusted } = evaluateHand(this.getDealer().hand);
    if (dealerHandTotal < 17) return true;
    if (dealerHandTotal < 18 && this.getDealer().hand.some(card => card.rank === 'Ace')) return true;
    if (dealerBusted) return false;
    const humanPlayerHandTotals = humanPlayers.map(player => evaluateHand(player.hand).handTotal)
    const dealerLowerThanAllPlayers = humanPlayerHandTotals.every(playerTotal => dealerHandTotal < playerTotal);
    if (dealerLowerThanAllPlayers) return true;

    return false;
  }

  getRenderedHand = player => {
    if (!player.hand) return null;
    const renderedHand = player.hand.map((card, index) => {
      return (
        <span key={`${player.id}-${index}-${card.rank}`}>
          {card.faceUp && `[${card.rank} of ${card.suit}] `}
          {!card.faceUp && '[Face Down] '}
        </span>
      )
    });
    return <span>{renderedHand}</span>;
  }

  deal = () => {
    const { actions, players } = this.props;
    this.props.actions.setStartGame(true);
    players.forEach(player => {
      if (player.id === DealerId) {
        actions.drawCard(player.id, false);
      } else {
        actions.drawCard(player.id);
      }
      actions.drawCard(player.id);
    });
  }

  stay = playerId => {
    this.props.actions.playerStayed(playerId);
  }

  drawCard = playerId => {
    this.props.actions.drawCard(playerId);
  }

  render() {
    const { gameStarted, players, actions } = this.props;
    return (
      <div className="App">

        <div>
          {this.getPlayers()}
        </div>

        <br />
        <button onClick={this.deal} disabled={gameStarted}>Deal</button>
      </div>
    );
  }
}


const mapDispatchToProps = dispatch => (
  {
    actions: bindActionCreators({
      ...actions
    }, dispatch)
  }
);

const mapStateToProps = state => (
  {
    players: state.rootReducer.players,
    gameStarted: state.rootReducer.gameStarted,
    dealerPlaying: state.rootReducer.dealerPlaying
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(App);
