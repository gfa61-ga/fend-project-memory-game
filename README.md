# Memory Game

## Table of Contents

* [Instructions](#instructions)
* [Additional functionality](#Additional-functionality)
* [Dependencies](#Dependencies)

## Instructions

The game board consists of sixteen "cards" arranged in a grid. The deck is made up of eight different pairs of cards, each with different symbols on one side. The cards are arranged randomly on the grid with the symbol face down. The gameplay rules are very simple: flip over two hidden cards at a time to locate the ones that match!

Each turn:

* The player flips one card over to reveal its underlying symbol.
* The player then turns over a second card, trying to find the corresponding card with the same symbol.
* If the cards match, both cards stay flipped over.
* If the cards do not match, both cards are flipped face down.

The game ends once all cards have been correctly matched.

## Additional-functionality

If your browser supports localstorage, you can:

* save the current game
* start another game or close your browser
* reload and continue the saved game whenever you want to.

The game leaderboard is also saved in localstorage, if it's available.

## Dependencies

This game is based on the starter code of [this](https://github.com/udacity/fend-project-memory-game) Udacity repository for the Front End Develpmpent students and uses:

* [Font Awesome Icons](https://fontawesome.com/) for card symbols etc and
* [animate.css](https://github.com/daneden/animate.css) for card animations.

