const Player = require('./player.js');
const Character = require('./character.js');
const CardHandler = require('./cardHandler.js');
const characterData = require('../data/characterData.json');

class Game {
  constructor(numberOfPlayers) {
    this.numberOfPlayers = numberOfPlayers;
    this.players = {};
    this.playerCount = 0;
    this.cardHandler = new CardHandler();
    this._murderCombination = {};
    this.started = false;
    this._turn=1;
  }
  addPlayer(name,id){
    let character = characterData[++this.playerCount];
    character = new Character(character);
    let player = new Player(name,character);
    this.players[id] = player;
  }
  get murderCombination(){
    return this._murderCombination;
  }
  getPlayerIdByTurn(){
    let listOfPlayerIds=Object.keys(this.players);
    return listOfPlayerIds[this._turn-1];
  }
  getPlayerCount(){
    return this.playerCount;
  }
  getPlayer(playerId){
    return this.players[playerId];
  }
  haveAllPlayersJoined(){
    return this.numberOfPlayers == this.playerCount;
  }
  getAllPlayerDetails(){
    let players = Object.keys(this.players);
    return players.reduce((details,playerId)=>{
      let player = this.players[playerId];
      details[playerId] = {
        name: player.name,
        character : {
          name : player.character.name,
          color: player.character.tokenColor
        }
      };
      return details;
    },{});
  }
  getPlayersPosition(){
    return Object.values(this.players).map((player)=>{
      let char = player.character;
      return {
        name:char.name,
        position:char.position,
        start : char.start
      };
    });
  }
  hasStarted(){
    return this.started;
  }
  start(){
    this.setMurderCombination();
    this.gatherRemainingCards();
    this.distributeCards();
    this.started = true;
  }
  setMurderCombination(){
    this._murderCombination = this.cardHandler.getRandomCombination();
  }
  getRandomCard(cards){
    return this.cardHandler.getRandomCard(cards);
  }
  hasRemainingCard(){
    return this.cardHandler.hasRemainingCard();
  }
  distributeCards(){
    let playerIds = Object.keys(this.players);
    while(this.hasRemainingCard()) {
      let currentPlayerId = playerIds.shift();
      let currentPlayer = this.players[`${currentPlayerId}`];
      let remainingCards = this.cardHandler._remainingCards;
      currentPlayer.addCard(this.getRandomCard(remainingCards));
      playerIds.push(currentPlayerId);
    }
  }
  rollDice(){
    if(!this.diceVal){
      this.diceVal = Math.ceil(Math.random()*6);
    }
    return this.diceVal;
  }
  gatherRemainingCards(){
    this.cardHandler.gatherRemainingCards();
  }
}

module.exports = Game;
