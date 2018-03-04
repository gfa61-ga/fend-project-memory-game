/*
 * Create a list that holds all game cards
 */

let cards = ['diamond', 'diamond',
    'paper-plane-o', 'paper-plane-o',
    'bicycle', 'bicycle',
    'anchor', 'anchor',
    'bolt', 'bolt',
    'cube', 'cube',
    'leaf', 'leaf',
    'bomb', 'bomb'
];

// Declare global variables
let matchedCards, moveCounter, starCounter, openCards;

// Set element selectors
const stars = document.querySelectorAll('.stars li i');
const secondStar = stars[1];
const thirdStar = stars[2];

const movesPanel = document.querySelector('.moves');
const restartButton = document.querySelector('.restart');
const deck = document.querySelector(".deck");

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function displayNewGameCards() {
    shuffle(cards);

    let deckHtml = '';

    for (const card of cards) {
        deckHtml += `
            <li class="card">
                <i class="fa fa-${card}"></i>
            </li>
        `;
    }

    deck.innerHTML = deckHtml;
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
}

// Reset counters, score panel etc
function setupNewGame() {
    matchedCards = 0;
    moveCounter = 0;
    openCards = [];

    starCounter = 3;
    secondStar.classList.replace('fa-star-o', 'fa-star');
    thirdStar.classList.replace('fa-star-o', 'fa-star');

    movesPanel.innerText = 0;
}

// Display the card's symbol
function displayCard(clickedCard) {
    clickedCard.classList.add('open', 'show');
};

// Add the card to a *list* of "open" cards
function addToOpenCards(clickedCard) {
    openCards.push(clickedCard);
};

// Increment the move counter and display it on the page
function updateMoveCounter() {
    movesPanel.innerText = ++moveCounter;
};

function updateStars() {
    if (moveCounter === 9) {
        thirdStar.classList.replace('fa-star', 'fa-star-o');
        starCounter = 2;
    }
    if (moveCounter === 15) {
        secondStar.classList.replace('fa-star', 'fa-star-o');
        starCounter = 1;
    }
};

// Lock the cards in the open position
function addToMachedCards() {
    for (const card of openCards) {
        card.classList.remove('open', 'show');
        card.classList.add('match');
    }
    // Empty openCards
    openCards = [];

    matchedCards += 2;
};

// Display a message with the final score
function displayFinalScore() {
    console.log('Congratulations! You won! with ' + moveCounter + ' moves');
    /* TODO */
};

// Remove the cards from the list and hide the card's symbol
function hideOpenCards() {
    for (const card of openCards) {
        card.classList.remove('open', 'show');
    }
    // Empty openCards
    openCards = [];
};

/*
 * Actions when the game is first loaded
 */

displayNewGameCards();
setupNewGame();

/*
 * set up the event listener for the cards. If a card is clicked:
 *  - display the card's symbol
 *  - add the card to a *list* of "open" cards
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol
 *    + increment the move counter and display it on the page
 *    + if all cards have matched, display a message with the final score
 */

 deck.addEventListener('click', function(e) {
    // If target is a card
    if (e.target.classList.contains('card')) {
        let clickedCard = e.target;
        // If the clicked card is not already matched
        if (clickedCard.classList.contains('match') === false) {
            // If the clicked card is not already open (is not clicked twice)
            if (openCards.includes(clickedCard) === false) {
                displayCard(clickedCard);
                addToOpenCards(clickedCard);
                // And if there is another open card, then we have a move to handle
                if (openCards.length > 1) {
                    updateMoveCounter();
                    updateStars();

                    firstCard = openCards[0];
                    firstCardSymbol = firstCard.children[0].className;
                    secondCard = openCards[1];
                    secondCardSymbol = secondCard.children[0].className;

                    // Check the equality of symbols classes
                    if (firstCardSymbol === secondCardSymbol) {
                        addToMachedCards();
                        if (matchedCards === 16) {
                            displayFinalScore();
                        }
                    } else {
                        hideOpenCards();
                    }
                }
            }
        }
    }
});

restartButton.addEventListener('click', function(e) {
    displayNewGameCards();
    setupNewGame();
});
