/*
 * Create a list that holds the 16 card-symbols
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
let gameStartTimeMsec, gameTimer, msecOfGameTime, cardClasses;

// Set element selectors
const gamePanel = document.querySelector('.game-panel');
const deck = document.querySelector('.deck');

const stars = document.querySelectorAll('.stars li i');
const secondStar = stars[1];
const thirdStar = stars[2];

const movesPanel = document.querySelector('.moves');
const restartButton = document.querySelector('.restart');

const timerArea = document.querySelector('.time-string');
const messageArea = document.querySelector('.message-area');
const message = document.querySelector('.message');
const saveButton = document.querySelector('.save');
const loadButton = document.querySelector('.load');

const winPanel = document.querySelector('.win-panel');
const gameTimeSpan = document.querySelector('.game-time');
const gameStarsSpan = document.querySelector('.star-number');
const playAgainButton = document.querySelector('.play-again');

/*
 * Implement game functions
 */

// Add each card's HTML to the page
function displayGameCards() {
    let deckHtml = '';

    for (const card of cards) {
        deckHtml += `
            <li class="card">
                <i class="fa fa-${card}"></i>
            </li>
        `;
    }
    // Create new card-elements
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

// Set initial values - start timer
function setupNewGame() {
    moveCounter = 0;
    movesPanel.innerText = 0;

    starCounter = 3;
    // display 2nd and 3rd stars
    secondStar.classList.replace('fa-star-o', 'fa-star');
    thirdStar.classList.replace('fa-star-o', 'fa-star');

    openCards = [];
    matchedCards = 0;

    // Start the timer
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

        // Remove card animation after 0.30 sec
        setTimeout(function() {
            clickedCard.classList.remove('pulse');
        }, 300);
    }
}

// Increment the move counter and display it on the page
function updateMoveCounter() {
    movesPanel.innerText = ++moveCounter;
}

// Hide stars according to moveCounter value
function updateStars() {
    // Hide 3rd star after 8th move
    if (moveCounter === 9) {
        thirdStar.classList.replace('fa-star', 'fa-star-o');
        starCounter = 2;
    }

    // Hide 2nd star after 14th move
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

        // Remove card animation after 0.50 sec
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
    // Display win panel
    gamePanel.style.display = 'none';
    winPanel.style.display = 'flex';

    gameTimeSpan.innerText =  msecToTimeString(msecOfGameTime);
    gameStarsSpan.innerText = starCounter === 1 ? starCounter + ' Star.' : starCounter + ' Stars.';
}

// Remove the cards from the list and hide the card's symbol
function hideOpenCards() {
    for (const card of openCards) {
        card.style.backgroundColor = '#f95b3c';

        // Add wobble animation to the selected cards
        card.classList.add('animated', 'wobble');

        // Remove card animation after 0.50 sec
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
    msecOfGameTime = msecNow - gameStartTimeMsec;

    const timeElapsed = msecToTimeString(msecOfGameTime);
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

// Start new game
function startNewGame() {
    // shuffle the list of card-symbols
    shuffle(cards);
    displayGameCards();
    setupNewGame();
}

// Store the classes of all cards in the cardClasses list
function getCardClasses() {
    // Select the current card-elements
    const cardElements = document.querySelectorAll('.deck .card');
    cardClasses = [];
    for (let index = 0; index < cardElements.length; index++) {
        cardClasses.push(cardElements[index].className);
    }
}

// Restore the classes of all cards from the cardClasses list
function restoreCardClasses() {
    // Select the new card-elements created from the displayGameCards function
    const cardElements = document.querySelectorAll('.deck .card');
    for (let index = 0; index < cardElements.length; index++) {
        cardElements[index].className = cardClasses[index];

        // If a card was open add it to the list-of-opened-cards
        if (cardElements[index].classList.contains('open')) {
            openCards.push(cardElements[index]);
        }
    }
}

// Save the current game
function saveGame() {
    // Save game-status variable-values
    localStorage.setItem('moveCounter', moveCounter);
    localStorage.setItem('starCounter', starCounter);
    localStorage.setItem('matchedCards', matchedCards);
    localStorage.setItem('msecOfGameTime', msecOfGameTime);

    // Save cards-symbols
    localStorage.setItem('cards', JSON.stringify(cards));

    // Save cards-status
    getCardClasses();
    localStorage.setItem('cardClasses', JSON.stringify(cardClasses));

    // Display successful-save message
    messageArea.style.display = 'inline-block';
    message.innerText = 'Game saved!';

    // Hide successful-save message after 2 seconds
    setTimeout(function() {
        messageArea.style.display = 'none';
    }, 2000);

    // Display load button after first save
    loadButton.style.display = 'inline-block';
}

// Load the saved game
function loadGame() {
    // Restore game-status variable-values
    moveCounter = parseInt(localStorage.getItem('moveCounter'));
    starCounter = parseInt(localStorage.getItem('starCounter'));
    matchedCards = parseInt(localStorage.getItem('matchedCards'));
    msecOfGameTime = parseInt(localStorage.getItem('msecOfGameTime'));

    // Restore cards-symbols
    cards = JSON.parse(localStorage.getItem('cards'));

    // Update cards HTML with restored cards-symbols
    displayGameCards();

    // Restore cards-status
    cardClasses = JSON.parse(localStorage.getItem('cardClasses'));
    restoreCardClasses();

    // Update moves panel with restored move-counter value
    movesPanel.innerText = moveCounter;

    // display 2nd and 3rd stars
    secondStar.classList.replace('fa-star-o', 'fa-star');
    thirdStar.classList.replace('fa-star-o', 'fa-star');
    // Hide stars according to moveCounter value
    updateStars();

    // Update timer with the restored value of game-time
    gameStartTimeMsec = Date.now() - msecOfGameTime;

    // Display successful-load message
    messageArea.style.display = 'inline-block';
    message.innerText = 'Game loaded!';

    // Hide successful-load message after 2 seconds
    setTimeout(function() {
        messageArea.style.display = 'none';
    }, 2000);
}

/*
 * Start game - add event listeners
 */

startNewGame();

// Add click listener for the cards
 deck.addEventListener('click', function(e) {
    // If clicked target is a card
    if (e.target.classList.contains('card')) {
        let clickedCard = e.target;
        // If the clicked card is not already matched
        if (clickedCard.classList.contains('match') === false) {
            // If the clicked card is not already open (is not clicked twice)
            if (openCards.includes(clickedCard) === false) {
                // Open the card
                displayCard(clickedCard);
                addToOpenCards(clickedCard);
                // If the list-of-opened-cards already has another card
                if (openCards.length > 1) {
                    updateMoveCounter();
                    updateStars();

                    firstCard = openCards[0];
                    firstCardSymbol = firstCard.children[0].className;
                    secondCard = openCards[1];
                    secondCardSymbol = secondCard.children[0].className;
                    // If the cards do match
                    if (firstCardSymbol === secondCardSymbol) {
                        addToMachedCards();
                        // If all cards have matched
                        if (matchedCards === 16) {
                            // Stop the timer
                            clearInterval(gameTimer);

                            setTimeout(function() {
                                displayFinalScore();
                            }, 2000);
                        }
                    } else {
                        // else the cards do not match
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

    // Display load button
    loadButton.style.display = 'inline-block';
});

// Add the event listener for save-game button
saveButton.addEventListener('click', function(e) {
    saveGame();
});

// Add the event listener for load-game button
loadButton.addEventListener('click', function(e) {
    loadGame();
});
