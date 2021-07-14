const boardSize = 2;
const board = [];
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const symbols = ['♥', '♦', '♣', '♠'];
let firstCard = null;
let firstCardElement;
let deck;
let canClick = true;
let matchCount = 0;
const gameInfo = document.createElement('div');

const generateCard = (cardRank, suit) => {
  let cardName = '';
  let cardDisplay = '';
  switch (cardRank) {
    case 1:
      cardName = 'Ace';
      cardDisplay = 'A';
      break;
    case 11:
      cardName = 'Jack';
      cardDisplay = 'J';
      break;
    case 12:
      cardName = 'Queen';
      cardDisplay = 'Q';
      break;
    case 13:
      cardName = 'King';
      cardDisplay = 'K';
      break;
    default:
      cardName = cardRank;
      cardDisplay = cardRank;
  }

  const cardColor = suit < 2 ? 'red' : 'black';

  const card = {
    symbol: symbols[suit],
    suit: suits[suit],
    name: cardName,
    displayName: cardDisplay,
    colour: cardColor,
    rank: cardRank,
    title: `${cardName} of ${suits[suit]}`,
  };
  return card;
};

const squareClick = (cardElement, column, row) => {
  console.log(cardElement);

  console.log('FIRST CARD DOM ELEMENT', firstCard);

  console.log('BOARD CLICKED CARD', board[column][row]);

  const clickedCard = board[column][row];

  // the user already clicked on this square
  if (cardElement.innerText !== '') {
    return;
  }

  // first turn
  if (firstCard === null) {
    console.log('first turn');
    gameInfo.innerText = '';
    firstCard = clickedCard;
    // turn this card over
    cardElement.innerHTML = `${firstCard.displayName} <br> ${firstCard.symbol}`;
    cardElement.classList.add('card-up', clickedCard.colour);
    output(`You flipped the ${firstCard.title}`);

    // hold onto this for later when it may not match
    firstCardElement = cardElement;

    // second turn
  } else {
    console.log('second turn');
    if (
      clickedCard.name === firstCard.name
        && clickedCard.suit === firstCard.suit
    ) {
      // match
      matchCount += 1;
      console.log('match');
      output(`You flipped the ${clickedCard.title}`);
      output('Match!');
      setTimeout(() => {
        gameInfo.innerText = '';
      }, 1500);
      // turn this card over
      cardElement.innerHTML = `${clickedCard.displayName} <br> ${clickedCard.symbol}`;
      cardElement.classList.add('card-up', clickedCard.colour);
      if (matchCount === (boardSize ** 2) / 2) {
        setTimeout(() => {
          alert('You win!');
        }, 10);
      }
    } else {
      console.log('NOT a match');
      output(`You flipped the ${clickedCard.title}`);
      output('No match!');
      canClick = false;
      cardElement.classList.add('card-up', clickedCard.colour);
      cardElement.innerHTML = `${clickedCard.displayName} <br> ${clickedCard.symbol}`;
      // turn this card back over
      setTimeout(() => {
        firstCardElement.innerText = '';
        firstCardElement.className = 'card-down';
        cardElement.innerText = '';
        cardElement.className = 'card-down';
        canClick = true;
        gameInfo.innerText = '';
      }, 1500);
    }

    // reset the first card
    firstCard = null;
  }
};

/* write a function that takes cardInfo and cardElement, adds div name and div symbol,
manipulates classes so that card is "face-up" */

/* write similar function for face-down */

const buildBoardElements = (board) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement('div');

  // give it a class for CSS purposes
  boardElement.classList.add('board');

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < board.length; i += 1) {
    // make a var for just this row of cards
    const row = board[i];

    // make an element for this row of cards
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    // make all the squares for this row
    for (let j = 0; j < row.length; j += 1) {
      // create the square element
      const square = document.createElement('div');

      // set a class for CSS purposes
      square.classList.add('card-down');

      // set the click event
      // eslint-disable-next-line
      square.addEventListener('click', (event) => {
        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"
        if (canClick) {
          squareClick(event.currentTarget, i, j);
        }
      });

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];

  for (let i = 1; i <= 13; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      const card = generateCard(i, j);
      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }
  return newDeck;
};

// Shuffle an array of cards
const shuffleCards = (cards) => {
  // Loop over the card deck array once
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    // Select a random index in the deck
    const randomIndex = Math.floor(Math.random() * cards.length);
    // Select the card that corresponds to randomIndex
    const randomCard = cards[randomIndex];
    // Select the card that corresponds to currentIndex
    const currentCard = cards[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cards[currentIndex] = randomCard;
    cards[randomIndex] = currentCard;
  }
  // Return the shuffled deck
  return cards;
};

// DOM output helper
const output = (message) => {
  gameInfo.innerHTML += `<br>${message}`;
};

const initGame = () => {
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  const doubleDeck = makeDeck();
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }

  const boardEl = buildBoardElements(board);

  document.body.appendChild(boardEl);
  document.body.appendChild(gameInfo);
};

initGame();
