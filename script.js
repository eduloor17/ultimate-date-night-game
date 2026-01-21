let cards = [];
let deck = [];
let usedCards = [];
let currentCard = null;
let timer;

let ladyScore = 0;
let boyScore = 0;
let turn = "Lady"; // Lady starts

fetch('cards.json')
  .then(response => response.json())
  .then(data => {
    cards = data;
    resetDeck();
  });

const drawBtn = document.getElementById('drawBtn');
const acceptBtn = document.getElementById('acceptBtn');
const rejectBtn = document.getElementById('rejectBtn');
const stopBtn = document.getElementById('stopBtn');

const cardText = document.getElementById('cardText');
const timerText = document.getElementById('timerText');
const rewardText = document.getElementById('rewardText');
const turnText = document.getElementById('turnText');

const categorySelect = document.getElementById('categorySelect');
const ladyScoreText = document.getElementById('ladyScore');
const boyScoreText = document.getElementById('boyScore');

function resetDeck() {
  let category = categorySelect.value;
  deck = category === 'all' ? [...cards] : cards.filter(c => c.category === category);
  shuffle(deck);
  usedCards = [];
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// DRAW CARD
drawBtn.addEventListener('click', () => {
  clearInterval(timer);
  timerText.textContent = '';
  rewardText.textContent = '';

  if (deck.length === 0) {
    cardText.textContent = "🎉 All cards drawn! Deck reset...";
    resetDeck();
    return;
  }

  currentCard = deck.pop();
  usedCards.push(currentCard);
  cardText.textContent = currentCard.text;

  handleReward(currentCard);
});

// ACCEPT CARD
acceptBtn.addEventListener('click', () => {
  if (!currentCard) return;
  
  if (turn === "Lady") ladyScore++;
  else boyScore++;

  updateScore();
  switchTurn();
  cardText.textContent = "Card completed! Draw next 😏";
  rewardText.textContent = "";
  timerText.textContent = "";
  currentCard = null;
});

// REJECT CARD
rejectBtn.addEventListener('click', () => {
  if (!currentCard) return;
  
  // Show unique playful punishment
  let punishment = currentCard.punishment ? currentCard.punishment : "Playful punishment 😏";
  rewardText.textContent = punishment;

  switchTurn();
  cardText.textContent = "Card rejected! Next turn 😋";
  currentCard = null;
  clearInterval(timer);
  timerText.textContent = "";
});

// STOP GAME
stopBtn.addEventListener('click', () => {
  let winner = ladyScore > boyScore ? "Lady wins! 🏆💖" :
               boyScore > ladyScore ? "Boy wins! 🏆💖" :
               "It's a tie! 😘";
  cardText.textContent = "Game Over! " + winner;
  rewardText.textContent = `Final Score → Lady: ${ladyScore}, Boy: ${boyScore}`;
  currentCard = null;
  clearInterval(timer);
  timerText.textContent = "";
});

// UPDATE SCORE DISPLAY
function updateScore() {
  ladyScoreText.textContent = ladyScore;
  boyScoreText.textContent = boyScore;
}

// SWITCH TURN
function switchTurn() {
  turn = turn === "Lady" ? "Boy" : "Lady";
  turnText.textContent = `Current Turn: ${turn}`;
}

// HANDLE REWARD AND TIMER
function handleReward(card) {
  let extraTime = 0;
  let message = '';

  // Double or Nothing chance
  let double = Math.random() < 0.25; // 25% chance
  if (double) {
    extraTime = 10; 
    message += "🎲 Double or Nothing! ";
  }

  switch(card.category) {
    case "flirty":
      message += "Winner gets a kiss 😘";
      break;
    case "dirty":
      message += "Flirty challenge 😏\nOptional: " + (card.punishment || "playful bite 😋");
      break;
    case "romantic":
      message += `Extra cuddle for 20 sec ${extraTime ? "+"+extraTime+"s" : ""} 💕`;
      startTimer(20 + extraTime);
      break;
    case "fun":
      message += `Dance for 20 sec ${extraTime ? "+"+extraTime+"s" : ""} 💃`;
      startTimer(20 + extraTime);
      break;
  }

  rewardText.textContent = message;
}

// TIMER FUNCTION
function startTimer(seconds) {
  let remaining = seconds;
  timerText.textContent = `Time: ${remaining}s`;

  timer = setInterval(() => {
    remaining--;
    timerText.textContent = `Time: ${remaining}s`;
    if (remaining <= 0) {
      clearInterval(timer);
      timerText.textContent = "⏰ Time's up!";
      rewardText.textContent += " Challenge complete! 😋";
    }
  }, 1000);
}

// Reset deck when category changes
categorySelect.addEventListener('change', () => {
  resetDeck();
  cardText.textContent = "Deck reset! Press Draw Card 😋";
  rewardText.textContent = '';
  timerText.textContent = '';
});
