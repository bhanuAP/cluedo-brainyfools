const chai = require('chai');
const assert = chai.assert;
const Game = require('../../src/models/game.js');

describe('Game', () => {
  let game;
  beforeEach(() => {
    game = new Game(3);
  });


  describe('#addPlayer', () => {
    it('should create new player with diff. characters', () => {
      game.addPlayer("suyog", 1);
      game.addPlayer("omkar", 2);
      let actualOutput = game.players[1];
      let expectedOutput = {
        _name:'suyog',
        _character:{
          "_name":"Miss Scarlett",
          "_tokenColor":"#bf0000",
          "_position":1,
          "_turn":1,
          "_start" : true
        },
        _cards:[]
      };
      assert.deepEqual(actualOutput, expectedOutput);
    });
  });


  describe('#getPlayer', () => {
    it('should return player by his/her id', () => {
      game.addPlayer("suyog", 1);
      game.addPlayer("omkar", 2);
      let player = game.getPlayer(1);
      assert.equal(player.name, 'suyog');
    });
  });


  describe('#getPlayerCount', () => {
    it('should return count of players joined', () => {
      game.addPlayer("suyog", 1);
      game.addPlayer("omkar", 2);
      let playerCount = game.getPlayerCount();
      assert.equal(playerCount, 2);
    });
  });


  describe('#haveAllPlayersJoined', function () {
    it('should return true when game is ready to start', function () {
      game.addPlayer("Pranav", 1);
      game.addPlayer("Patel", 2);
      game.addPlayer("JD", 3);
      assert.isOk(game.haveAllPlayersJoined());
    });

    it('should return false when isnt ready to start', function () {
      game.addPlayer("Pranav", 1);
      game.addPlayer("Patel", 2);
      assert.isNotOk(game.haveAllPlayersJoined());
    });
  });

  describe('#getAllPlayerDetails', function () {
    it('should return details of 1 players', function () {
      game.addPlayer("Madhuri", 1);
      let expected = {
        1: {
          name: "Madhuri",
          character: {
            name: "Miss Scarlett",
            color: "#bf0000",
            turn:1
          }
        }
      };
      assert.deepEqual(game.getAllPlayerDetails(1), expected);
    });
    it('should return empty for no players', function () {
      let expected = {
      };
      assert.deepEqual(game.getAllPlayerDetails(0), expected);
    });
    it('should return details of 2 players', function () {
      game.addPlayer("Madhuri", 2);
      game.addPlayer("Neeraj", 23);
      let expected = {
        1: {
          name: "Madhuri",
          character: {
            name: "Miss Scarlett",
            color: "#bf0000",
            turn:1
          }
        },
        23: {
          name: "Neeraj",
          character: {
            "color": "#ffdb58",
            "name": "Col. Mustard",
            turn:2
          }
        }
      };
      assert.deepEqual(game.getAllPlayerDetails(23), expected);
    });
  });

  describe("#getCurrentPlayer", () => {
    it("should return id of player according to turn", () => {
      game.addPlayer("Suyog", 1);
      game.addPlayer("Bhanu", 2);
      game.addPlayer("Omkar", 3);
      assert.deepEqual(game.getCurrentPlayer(), {
        name: 'Suyog',
        character: {
          "color": "#bf0000",
          "name": "Miss Scarlett",
          'turn':1
        }
      });
    });
  });
  describe('#getPlayersPosition', function () {
    it('should return all player\'s positions', function () {
      game.addPlayer("Pranav", 1);
      game.addPlayer("Patel", 2);
      let actualOutput = game.getPlayersPosition();
      let expected = [
        {
          name: "Miss Scarlett",
          position: 1,
          start: true
        },
        {
          "name": "Col. Mustard",
          position: 11,
          start: true
        }
      ];
      assert.deepEqual(actualOutput, expected);
    });
  });

  describe('#hasGameStarted', function () {
    it('should return true when game has started', function () {
      assert.isNotOk(game.hasStarted());
      game.addPlayer('Patel',205)
      game.start();
      assert.isOk(game.hasStarted());
    });
  });

  describe('#selectMurderCombination', function () {
    it('should select murder combination', function () {
      let roomCards = game.cardHandler.rooms;
      let weaponCards = game.cardHandler.weapons;
      let characterCards = game.cardHandler.characters;
      game.setMurderCombination();

      let murderCombination = game._murderCombination;

      assert.notDeepInclude(roomCards, murderCombination.room);
      assert.notDeepInclude(weaponCards, murderCombination.weapon);
      assert.notDeepInclude(characterCards, murderCombination.character);
    });
  });
  describe('#rollDice', () => {
    it('should return value ranging from 1 to 6', () => {
      for (let index = 0; index < 10; index++) {
        let val = game.rollDice();
        assert.isAbove(val, 0);
        assert.isBelow(val, 7);
      };
    });
  });

  describe('#collectRemainingCards', function(){
    it('should collect remaining cards', function(){
      let rooms = game.cardHandler.rooms;
      let weapons = game.cardHandler.weapons;
      let characters = game.cardHandler.characters;
      let allCards = [...rooms,...weapons,...characters];
      game.gatherRemainingCards();
      assert.deepEqual(allCards,game.cardHandler._remainingCards);
      assert.deepEqual(game.cardHandler.rooms,[]);
      assert.deepEqual(game.cardHandler.weapons,[]);
      assert.deepEqual(game.cardHandler.characters,[]);
    });
  });

  describe('#getRandomCard', function(){
    it('should return random card from remaining card', function(){
      let rooms = game.cardHandler.rooms;
      let weapons = game.cardHandler.weapons;
      let characters = game.cardHandler.characters;
      let allCards = [...rooms,...weapons,...characters];
      game.gatherRemainingCards();
      let randomCard = game.getRandomCard(allCards);
      assert.notDeepInclude(randomCard,allCards);
    });
  });

  describe('#hasRemainingCard', function(){
    it('should check wheather it has any remaining card', function(){
      assert.isNotOk(game.hasRemainingCard());
      game.gatherRemainingCards();
      assert.isOk(game.hasRemainingCard());
    });
  });

  describe('#distributeCards', function(){
    it('should distribute cards among all players', function(){
      game.addPlayer('Patel',1);
      game.addPlayer('Pranav',2);
      assert.isNotOk(game.hasRemainingCard());
      game.gatherRemainingCards()
      assert.isOk(game.hasRemainingCard());
      game.distributeCards();
      assert.isNotOk(game.hasRemainingCard());
    });
  });

  describe('#isCurrentPlayer', () => {
    it('should return true for first player', () => {
      game.addPlayer("Pranav", 1);
      game.addPlayer("Patel", 2);
      assert.isOk(game.isCurrentPlayer(1));
    });
    it('should return false for other player', () => {
      game.addPlayer("Pranav", 1);
      game.addPlayer("Patel", 2);
      assert.isFalse(game.isCurrentPlayer(2));
    });
  });
  describe('#validateMove', () => {
    it('should return true for valid forward move', () => {
      game.addPlayer("Pranav", 1);
      game.diceVal = 1;
      assert.isOk(game.validateMove(1));
      game.diceVal = 2;
      assert.isOk(game.validateMove(2));
      game.diceVal = 5;
      assert.isOk(game.validateMove(5));
      game.diceVal = 79;
      assert.isOk(game.validateMove(1));
    });
    it('should return true for valid backward move', () => {
      game.addPlayer("Pranav", 1);
      game.diceVal = 2;
      assert.isOk(game.validateMove(78));
      game.diceVal = 5;
      assert.isOk(game.validateMove(75));
    });
    it('should return false for invalid forward move', () => {
      game.addPlayer("Pranav", 1);
      game.diceVal = 1;
      assert.isFalse(game.validateMove(4));
      game.diceVal = 2;
      assert.isFalse(game.validateMove(6));
      game.diceVal = 5;
      assert.isFalse(game.validateMove(1));
    });
    it('should return false for invalid backward move', () => {
      game.addPlayer("Pranav", 1);
      game.diceVal = 2;
      assert.isFalse(game.validateMove(76));
      game.diceVal = 5;
      assert.isFalse(game.validateMove(74));
    });
  });

  describe('#updatePlayerPos()',()=>{
    it('should update player\'s position',()=>{
      game.addPlayer("Pranav", 1);
      game.diceVal = 2;
      assert.isOk(game.updatePlayerPos(75));
      let player = game.players[1];
      let characterPos = player.character.position;
      assert.equal(characterPos,75);
      assert.isFalse(player.character.start);
    });
    it('should return false if already moved',()=>{
      game.addPlayer("Pranav", 1);
      game.diceVal = 2;
      game.updatePlayerPos(2);
      assert.isFalse(game.updatePlayerPos(3));
    });
  });
});
