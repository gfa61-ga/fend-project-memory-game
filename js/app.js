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
let gameStartTimeMsec, gameTimer, msecElapsed;

// Set element selectors
const stars = document.querySelectorAll('.stars li i');
const secondStar = stars[1];
const thirdStar = stars[2];

const movesPanel = document.querySelector('.moves');
const restartButton = document.querySelector('.restart');
const deck = document.querySelector('.deck');
const timerArea = document.querySelector('.time-string');
const gamePanel = document.querySelector('.game-panel');
const winPanel = document.querySelector('.win-panel');
const gameTimeSpan = document.querySelector('.game-time');
const gameStarsSpan = document.querySelector('.star-number');
const playAgainButton = document.querySelector('.play-again');

/*
 * Implement game functions
 */

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

// Reset counters, score panel, timer etc
function setupNewGame() {
    matchedCards = 0;
    moveCounter = 0;
    openCards = [];

    starCounter = 3;
    secondStar.classList.replace('fa-star-o', 'fa-star');
    thirdStar.classList.replace('fa-star-o', 'fa-star');

    movesPanel.innerText = 0;

    gameStartTimeMsec = Date.now();
    gameTimer = setInterval(updateTimer, 200);
}

// Display the card's symbol
function displayCard(clickedCard) {
    clickedCard.classList.add('open', 'show');
}

// Add the card to a *list* of "open" cards
function addToOpenCards(clickedCard) {
    openCards.push(clickedCard);

    if (openCards.length === 1) {
        clickedCard.style.backgroundColor = '#02b3e4';

        // Add pulse animation to the first card
        clickedCard.classList.add('animated', 'pulse');

        setTimeout(function() {
            clickedCard.classList.remove('pulse');
        }, 300);
    }
}

// Increment the move counter and display it on the page
function updateMoveCounter() {
    movesPanel.innerText = ++moveCounter;
}

function updateStars() {
    if (moveCounter === 9) {
        thirdStar.classList.replace('fa-star', 'fa-star-o');
        starCounter = 2;
    }
    if (moveCounter === 15) {
        secondStar.classList.replace('fa-star', 'fa-star-o');
        starCounter = 1;
    }
}

// Lock the cards in the open position
function addToMachedCards() {
    for (const card of openCards) {
        card.style.backgroundColor = '#02ccba';
        card.classList.remove('open', 'show');

        // Add rubberBand animation to the matched cards
        card.classList.add('match', 'animated', 'rubberBand');

        setTimeout(function() {
            card.classList.remove('rubberBand');
        }, 500);
    }

    // Empty openCards
    openCards = [];

    matchedCards += 2;
}

// Display a message with the final score
function displayFinalScore() {
    // Stop the timer
    clearInterval(gameTimer);

    // Display win panel
    gamePanel.style.display = 'none';
    winPanel.style.display = 'flex';

    gameTimeSpan.innerText =  msecToTimeString(msecElapsed);
    gameStarsSpan.innerText = starCounter === 1 ? starCounter + ' Star.' : starCounter + ' Stars.';
}

// Remove the cards from the list and hide the card's symbol
function hideOpenCards() {
    for (const card of openCards) {
        card.style.backgroundColor = '#f95b3c';

        // Add wobble animation to the selected cards
        card.classList.add('animated', 'wobble');

        setTimeout(function() {
            card.classList.remove('wobble', 'open', 'show');
            card.style.backgroundColor = '#2e3d49';
        }, 500);
    }

    // Empty openCards
    openCards = [];
}

// Update game's timer
function updateTimer() {
    const msecNow = Date.now();
    msecElapsed = msecNow - gameStartTimeMsec;

    const timeElapsed = msecToTimeString(msecElapsed);
    timerArea.innerText = timeElapsed;
}

// Convert milliseconds to timeString
function msecToTimeString(timeInMsecs) {
    const timeConverter = new Date();
    timeConverter.setTime(timeInMsecs);

    // use 24-hour time, in order to start time count from 00:00:00
    const options = {
        timeZone: 'UTC',
        minute: '2-digit',
        second:'2-digit',
        hour12: false
    };

    const timeString = timeConverter.toLocaleTimeString('en-US', options);
    return timeString;
}

function startNewGame() {
    displayNewGameCards();
    setupNewGame();
}

/*
 * Start game
 */

startNewGame();

/*
 * Add the event listener for the cards. If a card is clicked:
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
                            setTimeout(function() {
                                displayFinalScore();
                            }, 2000);
                        }
                    } else {
                        hideOpenCards();
                    }
                }
            }
        }
    }
});

// Add the event listener for restart button
restartButton.addEventListener('click', function(e) {
    startNewGame();
});

// Add the event listener for play-again button
playAgainButton.addEventListener('click', function(e) {
    startNewGame();

    // Display game panel
    gamePanel.style.display = 'flex';
    winPanel.style.display = 'none';
});
