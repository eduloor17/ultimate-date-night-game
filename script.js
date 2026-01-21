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
const rewardText = document.getElementById('rewardText');
const categorySelect = document.getElementById('categorySelect');

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

  handleRewards(card);
});

// Reset deck when category changes
categorySelect.addEventListener('change', () => {
  resetDeck();
  cardText.textContent = "Deck reset! Press Draw Card 😋";
  rewardText.textContent = '';
  timerText.textContent = '';
});

function handleRewards(card) {
  let extraTime = 0;
  let message = '';

  // Random chance for double or nothing
  let double = Math.random() < 0.25; // 25% chance
  if (double) {
    extraTime = 10; // extra seconds
    message += "🎲 Double or Nothing! ";
  }

  switch(card.category) {
    case "flirty":
      message += "Winner gets a kiss 😘";
      break;
    case "dirty":
      // playful punishment card example
      message += "Flirty touch challenge 😏\nOptional: remove a piece of clothing with your mouth 😋";
      break;
    case "romantic":
      message += `Extra cuddle for 20 sec ${extraTime ? "+"+extraTime+"s" : ""} 💕`;
      startTimer(20 + extraTime);
      break;
    case "fun":
      message += `Dance like reggaeton star for 20 sec ${extraTime ? "+"+extraTime+"s" : ""} 💃`;
      startTimer(20 + extraTime);
      break;
  }

  rewardText.textContent = message;
}

// Timer function
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
