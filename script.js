let cards = [];
let deck = [];
let usedCards = [];
let timer;

fetch('cards.json')
  .then(response => response.json())
  .then(data => {
    cards = data;
    resetDeck();
  });

const drawBtn = document.getElementById('drawBtn');
const cardText = document.getElementById('cardText');
const timerText = document.getElementById('timerText');
const categorySelect = document.getElementById('categorySelect');
const rewardText = document.getElementById('rewardText');

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

drawBtn.addEventListener('click', () => {
  clearInterval(timer);
  timerText.textContent = '';
  rewardText.textContent = '';

  if (deck.length === 0) {
    cardText.textContent = "🎉 All cards drawn! Deck reset...";
    resetDeck();
    return;
  }

  let card = deck.pop();
  usedCards.push(card);
  cardText.textContent = card.text;

  handleRewards(card.category);
});

// Reset deck when category changes
categorySelect.addEventListener('change', () => {
  resetDeck();
  cardText.textContent = "Deck reset! Press Draw Card 😋";
  rewardText.textContent = '';
  timerText.textContent = '';
});

// Handle mini-reward system & timer
function handleRewards(category) {
  switch(category) {
    case "flirty":
      rewardText.textContent = "Winner gets a kiss 😘";
      break;
    case "dirty":
      rewardText.textContent = "Flirty touch challenge 😏";
      break;
    case "romantic":
      rewardText.textContent = "Extra cuddle for 20 sec 💕";
      startTimer(20);
      break;
    case "fun":
      rewardText.textContent = "Dance like reggaeton star for 20 sec 💃";
      startTimer(20);
      break;
    default:
      rewardText.textContent = "";
  }
}

// Timer function for challenges
function startTimer(seconds) {
  let remaining = seconds;
  timerText.textContent = `Time: ${remaining}s`;

  timer = setInterval(() => {
    remaining--;
    timerText.textContent = `Time: ${remaining}s`;
    if (remaining <= 0) {
      clearInterval(timer);
      timerText.textContent = "Time's up! ⏰";
      rewardText.textContent = "Challenge complete! 😋";
    }
  }, 1000);
}
