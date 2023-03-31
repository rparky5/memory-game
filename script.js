"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "#DEA3E3", "#E3BEA3", "#4E4CC1", "#7AE592", "#E57A7A",
  "#DEA3E3", "#E3BEA3", "#4E4CC1", "#7AE592", "#E57A7A",
];

const colors = shuffle(COLORS);
const gameBoard = document.getElementById("game");
const cards = document.querySelectorAll('#game div');
createCards(colors);


/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */


function createCards(colors) {
  for (let i = 0; i < colors.length; i++) {
    cards[i].setAttribute('class', colors[i]);
    cards[i].addEventListener('click', function(e){
      handleCardClick(e.target);
    });
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  card.style.backgroundColor = card.className;
  card.dataset.flipped = 'true';
}

/** Flip a card face-down. */

function unFlipCard(card1, card2) {
  card1.style.backgroundColor = '';
  card1.dataset.flipped = 'false';
  card2.style.backgroundColor = '';
  card2.dataset.flipped = 'false';
  for (let card of cards) {
    if (card.dataset.matched === 'false') {
      card.dataset.flipped = 'false';
    }
  };
}

/** Handle clicking on a card: this could be first-card or second-card. */
let matches = 0;
let currentCards = [];
function handleCardClick(evt) {
  if (currentCards.length < 2 && evt.dataset.flipped === 'false'
  && evt.dataset.matched === 'false') {
    flipCard(evt);
    currentCards.push(evt);
    if (currentCards.length === 2) {
      for (let card of cards) {
        card.dataset.flipped = 'true';
      }
      checkMatch(currentCards[0], currentCards[1]);
    }
  }
}

function checkMatch(card1, card2) {
  if (card1.className === card2.className) {
    currentCards = [];
    matches++;
    if (matches === 5) {
      document.querySelector('#end').style.display = 'block';
    }
    card1.dataset.matched = 'true';
    card2.dataset.matched = 'true';
    for (let card of cards) {
      if (card.dataset.matched === 'false') {
        card.dataset.flipped = 'false';
      }
    };
  } else {
    currentCards = [];
    setTimeout(function () {
      unFlipCard(card1, card2);
    }, 1000);
  }
}

document.querySelector('button').addEventListener('click', function () {
  for (let card of cards) {
    card.style.backgroundColor = '';
    card.dataset.flipped = 'false';
    card.dataset.matched = 'false';
  }
  shuffle(COLORS);
  createCards(colors);
  currentCards = [];
  matches = 0;
  document.querySelector('#end').style.display = 'none';
});