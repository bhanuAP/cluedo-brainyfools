/* eslint-disable no-empty-function no-implicit-globals*/
const updateTokenPos = function(positions){
  positions.forEach((char)=>{
    let name = char.name;
    let id = name.split(' ').pop().toLowerCase();
    if(!char.inactive) {
      updateCharPosition(id, char.position);
    }
  });
};

const updateCharPosition = function(id,pos){
  if (isRoom(pos)) {
    pos = `${id}-${pos}`;
  }
  let posElement = document.getElementById(`${pos}`);
  let posX = posElement.getAttribute('x');
  let posY = posElement.getAttribute('y');
  document.getElementById(`${id}`).setAttribute('cx',+posX+ 23);
  document.getElementById(`${id}`).setAttribute('cy',+posY+ 23);
};

const showBoardStatus = function() {
  let path = getBaseUrl();
  sendAjaxRequest('get',`${path}/boardstatus`,(res)=>{
    let charPositions = JSON.parse(res);
    updateTokenPos(charPositions);
  });
};

let dice;
let dices = ['&#9856;', '&#9857;', '&#9858;', '&#9859;', '&#9860;', '&#9861;'];
let stopped = true;
let timer;

function change(val) {
  let random = Math.floor(Math.random()*6);
  if(val){
    dice.innerHTML = dices[+val-1];
    return;
  }
  dice.innerHTML = dices[random];
}

function stopstart() {
  if(stopped) {
    stopped = false;
    timer = setInterval(change, 100);
  } else {
    clearInterval(timer);
    stopped = true;
  }
}
const enableRollDice = function(){
  document.querySelector('#dice-box').innerHTML = `
  <div id="roll-dice">
    <span class="rolldice" onclick="rollDice()" id="dice"></span>
  </div>`;
  disablePopup();
  dice = document.getElementById("dice");
  change(1);
};

const disableRollDice = function(){
  document.querySelector('#dice-box').innerHTML = ``;
};

const showCards = function(suspect){
  let charNames = ['Miss Scarlett','Rev Green','Col Mustard',
    'Dr Orchid','Mrs Peacock','Prof Plum'];
  let characterCards = charNames.map(name=>{
    return {_name:name,_type:'Character'};
  });
  let weaponNames = ['Candlestick','Dagger','Lead_Pipe',
    'Revolver','Rope','Wrench'];
  let weaponCards = weaponNames.map(name=>{
    return {_name:name,_type:'Weapon'};
  });
  let charImages = getImages(characterCards);
  let weaponImages = getImages(weaponCards);
  document.querySelector('#message-box').innerHTML = `
  <div class="back-button">
    <span id='back' onclick="getCurrentPlayer()">&#x226a;</span>
    <span id='message'>${suspect?'Suspect':'Accuse'}</span>
  <div>`;
  document.querySelector('#activity-box').innerHTML = `
  <div class="popup">
  <div class='cards'>Select a character</div>
  <div id="character"> ${charImages}</div>
  <div class='cards'>Select a weapon</div>
  <div id="weapon"> ${weaponImages}</div>
  ${`<button type="button" onclick="confirmCombination(${suspect})">
  Confirm</button>`}
  </div>`;
  enablePopup();
};

const confirmCombination = function(suspect){
  let cards = getSelectedCards();
  if((cards.char && cards.weapon)){
    suspectOrAccuse(suspect,cards);
  }
};

const getSelectedCards = function(){
  let char = getHighlightedCard('character');
  let weapon = getHighlightedCard('weapon');
  return {char:char,weapon:weapon};
};

const showPossibleOptions = function(suspect, rolldice,secretPassage){
  let messageBox = document.getElementById('message-box');
  messageBox.innerHTML='';
  document.querySelector('#activity-box').innerHTML = `<div class="popup">
  <div id="confirm">
  ${suspect? `<button onclick="showCards(${suspect})"
  >Suspect</button>`:''}
  ${`<button onclick="showCards()">Accuse</button>`}
  ${rolldice ? `<button onclick="enableRollDice();disablePopup()"
  >Roll&nbsp;Dice</button>` : ''}
  <button onclick="passTurn()">Pass</button>
  ${secretPassage ? `<button
  onclick="moveToken('${secretPassage}');disablePopup()"
  >Secret&nbsp;Passage</button>` : ''}
  </div></div>`;
  enablePopup();
};

const enableAccusation = function() {
  enableSuspicion(false,true);
};

const disablePopup = function () {
  document.getElementById('myModal').style.display = "none";
};
const enablePopup = function () {
  document.getElementById('myModal').style.display = "block";
};

const showMessage = function(message){
  document.querySelector('#dice-box')
    .innerHTML = `<div id='imp-message-box'>${message}</div>`;
};

const getBaseUrl = function(){
  return window.location.pathname.replace(/\/$/,'');
};

const showSuspicionCards = function(cards) {
  let characterCard = cards.character.replace(/[.\s]+/,'_');
  let weaponCard = cards.weapon.replace(/[.\s]+/,'_');
  let roomCard = cards.room.replace(/[.\s]+/,'_').split('_')[0];
  document.getElementById('character-card').setAttribute('src',
    `/images/cards/Character/${characterCard}.jpg`);
  document.getElementById('weapon-card').setAttribute('src',
    `/images/cards/Weapon/${weaponCard}.jpg`);
  document.getElementById('room-card').setAttribute('src',
    `/images/cards/Room/${roomCard}.jpg`);
};

const showWeapon = function (room,weapon) {
  let weaponImg=weapon.replace(/[.\s]+/,'_');
  let imagePath = `/images/weapons/${weaponImg}.png`;
  document.getElementById(`weapon-${room}`).setAttribute("href", imagePath);
};

const disableWeapon = function () {
  document.getElementById(`weapon-hall`).setAttribute("href", "");
  document.getElementById(`weapon-kitchen`).setAttribute("href", "");
  document.getElementById(`weapon-dining`).setAttribute("href", "");
  document.getElementById(`weapon-billiard`).setAttribute("href", "");
  document.getElementById(`weapon-ballroom`).setAttribute("href", "");
  document.getElementById(`weapon-study`).setAttribute("href", "");
  document.getElementById(`weapon-lounge`).setAttribute("href", "");
  document.getElementById(`weapon-conservatory`).setAttribute("href", "");
  document.getElementById(`weapon-library`).setAttribute("href", "");
};

window.addEventListener('load',()=>{
  boardStatusId = setInterval(showBoardStatus,3000);
});
