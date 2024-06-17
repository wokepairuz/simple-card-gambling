let deck = [];
let playerHand = [];
let dealerHand = [];
let playerHasLost = false;
let playerScore = 0;
let dealerScore = 0;
let currency = 100;
let currentBet = 0;

const suits = ['♥', '♦', '♣', '♠'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const restartButton = document.getElementById('restart-button');
const placeBetButton = document.getElementById('place-bet-button');
const messageDiv = document.getElementById('message');
const playerHandDiv = document.getElementById('player-hand');
const dealerHandDiv = document.getElementById('dealer-hand');
const playerScoreDiv = document.getElementById('player-score');
const dealerScoreDiv = document.getElementById('dealer-score');
const currencyDiv = document.getElementById('currency');
const betBox = document.getElementById('bet-box');
const betAmountInput = document.getElementById('bet-amount');

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function getCardValue(card) {
    if (card.value === 'A') return 11;
    if (['K', 'Q', 'J'].includes(card.value)) return 10;
    return parseInt(card.value);
}

function calculateHandValue(hand) {
    let value = 0;
    let aceCount = 0;
    for (let card of hand) {
        value += getCardValue(card);
        if (card.value === 'A') aceCount++;
    }
    while (value > 21 && aceCount > 0) {
        value -= 10;
        aceCount--;
    }
    return value;
}

function dealInitialCards() {
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    updateUI();
}

function updateUI() {
    playerHandDiv.innerHTML = '';
    dealerHandDiv.innerHTML = '';
    playerHand.forEach(card => playerHandDiv.appendChild(createCardElement(card)));
    dealerHand.forEach(card => dealerHandDiv.appendChild(createCardElement(card)));
    playerScoreDiv.textContent = `Total: ${calculateHandValue(playerHand)}`;
    dealerScoreDiv.textContent = `Total: ${calculateHandValue(dealerHand)}`;
    currencyDiv.textContent = `Currency: $${currency}`;
}

function createCardElement(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.innerHTML = `<div>${card.value}</div><div class="suit">${card.suit}</div>`;
    return cardDiv;
}

function checkGameOver() {
    playerScore = calculateHandValue(playerHand);
    dealerScore = calculateHandValue(dealerHand);

    if (playerScore > 21) {
        messageDiv.textContent = "You busted! Dealer wins.";
        playerHasLost = true;
        currency -= currentBet;
        gameOver();
        return true;
    } else if (dealerScore > 21) {
        messageDiv.textContent = "Dealer busted! You win.";
        currency += currentBet;
        gameOver();
        return true;
    } else if (playerScore === 21) {
        messageDiv.textContent = "Blackjack! You win.";
        currency += currentBet;
        gameOver();
        return true;
    }
    return false;
}

function dealerTurn() {
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(deck.pop());
    }
    updateUI();
    checkGameOver();
    if (!playerHasLost) {
        if (dealerScore > 21) {
            messageDiv.textContent = "Dealer busted! You win.";
            currency += currentBet;
        } else if (dealerScore > playerScore) {
            messageDiv.textContent = "Dealer wins.";
            currency -= currentBet;
        } else if (dealerScore < playerScore) {
            messageDiv.textContent = "You win.";
            currency += currentBet;
        } else {
            messageDiv.textContent = "It's a tie.";
        }
        gameOver();
    }
}

function gameOver() {
    hitButton.disabled = true;
    standButton.disabled = true;
    restartButton.style.display = 'block';
    updateUI();
}

function resetGame() {
    playerHasLost = false;
    hitButton.disabled = true;
    standButton.disabled = true;
    placeBetButton.disabled = false;
    restartButton.style.display = 'none';
    messageDiv.textContent = '';
    betBox.style.display = 'block';
    createDeck();
    shuffleDeck();
    updateUI();
}

placeBetButton.addEventListener('click', () => {
    currentBet = parseInt(betAmountInput.value);
    if (currentBet > 0 && currentBet <= currency) {
        betBox.style.display = 'none';
        hitButton.disabled = false;
        standButton.disabled = false;
        placeBetButton.disabled = true;
        dealInitialCards();
        checkGameOver();
    } else {
        messageDiv.textContent = "Invalid bet amount!";
    }
});

hitButton.addEventListener('click', () => {
    playerHand.push(deck.pop());
    updateUI();
    if (!checkGameOver()) {
        if (playerHasLost) {
            dealerTurn();
        }
    }
});

standButton.addEventListener('click', dealerTurn);

restartButton.addEventListener('click', resetGame);

// Initialize the game
createDeck();
shuffleDeck();
updateUI();
