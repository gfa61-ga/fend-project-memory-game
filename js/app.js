/*
 * Create a list that holds all of your cards
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

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

const deck = document.querySelector(".deck");

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

    return array;
}

displayNewGameCards();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

let matchedCards, moveCounter, openCards;

function setupNewGame() {
    matchedCards = 0;
    moveCounter = 0;
    openCards = [];
}

function displayCard(clickedCard) {
    clickedCard.classList.add('open', 'show');
};

function addToOpenCards(clickedCard) {
    openCards.push(clickedCard);
};

function updateMoveCounter() {
    moveCounter++;
    /* TODO */
};

function updateStars() {
    /* TODO */
};

function addToMachedCards() {
    for (const card of openCards) {
        card.classList.remove('open', 'show');
        card.classList.add('match');
    }
    // empty openCards
    openCards = [];
    matchedCards += 2;
};

function displayFinalScore() {
    console.log('Congratulations! You won! with ' + moveCounter + ' moves');
    /* TODO */
};

function hideOpenCards() {
    for (const card of openCards) {
        card.classList.remove('open', 'show');
    }
    // empty openCards
    openCards = [];
};

setupNewGame();

deck.addEventListener('click', function(e) {
    // if target is a card
    if (e.target.classList.contains('card')) {
        let clickedCard = e.target;
        // if the clicked card is not already matched
        if (clickedCard.classList.contains('match') === false) {
            // if the clicked card is not already open (not clicked twice)
            if (openCards.includes(clickedCard) === false) {
                displayCard(clickedCard);
                addToOpenCards(clickedCard);
                // if there is another open card then we have a move to check
                if (openCards.length > 1) {
                    updateMoveCounter();
                    updateStars();
                    firstCard = openCards[0];
                    firstCardSymbol = firstCard.children[0].className;
                    secondCard = openCards[1];
                    secondCardSymbol = secondCard.children[0].className;
                    // check the equality of symbols classes
                    if (firstCardSymbol === secondCardSymbol) {
                        addToMachedCards();
                        if (matchedCards === 2) {
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
