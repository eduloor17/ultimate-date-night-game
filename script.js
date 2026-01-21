let cards = [];
let deck = [];
let usedCards = [];

fetch('cards.json')
  .then(response => response.json())
  .then(data => {
    cards = data;
    resetDeck(); // initialize deck
  });

const drawBtn = document.getElementById('drawBtn');
const cardText = document.getElementById('cardText');
const categorySelect = document.getElementById('categorySelect');

function resetDeck() {
  let category = categorySelect.value;
  deck = category === 'all' ? [...cards] : cards.filter(c => c.category === category);
  shuffle(deck);
  usedCards = [];
}

// Fisher–Yates shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

drawBtn.addEventListener('click', () => {
  if (deck.length === 0) {
    cardText.textContent = "🎉 All cards drawn! Resetting deck...";
    resetDeck();
    return;
  }

  let card = deck.pop();
  usedCards.push(card);
  cardText.textContent = card.text;
});

// Reset deck when category changes
categorySelect.addEventListener('change', () => {
  resetDeck();
  cardText.textContent = "Deck reset! Press Draw Card 😋";
});
