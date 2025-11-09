const userId = "demoUser"; // Later replace with real user id
let deck = [];
let flippedCards = [];
let coins = 0;
let tries = 0;

document.getElementById("restart-game").addEventListener("click", startGame);

async function rewardUser(points) {
    try {
        const res = await fetch("http://localhost:8080/api/wallets/reward", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: "demoUser", // Replace with real user ID if available
                points: points
            })
        });

        const data = await res.json();
        console.log("Points added:", data);
    } catch (err) {
        console.error("Failed to reward user:", err);
    }
}

async function startGame() {
    try {
        const res = await fetch("http://localhost:8080/memory/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include'  // send session cookie automatically
        });

        if (!res.ok) {
            console.error("Failed to start game:", res.status, res.statusText);
            return;
        }

        const data = await res.json();
        deck = data.deck;
        coins = data.coins;
        tries = data.tries;

        updateCoins();
        updateTries();
        renderCards();
    } catch (err) {
        console.error("Error starting game:", err);
    }
}

// Only call after user logs in successfully
startGame();



function renderCards() {
  const grid = document.getElementById("card-grid");
  grid.innerHTML = "";

  deck.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = index;
    card.addEventListener("click", () => flipCard(card));
    grid.appendChild(card);
  });
}

async function flipCard(card) {
  if (flippedCards.length === 2 || card.classList.contains("flipped")) return;

  const index = card.dataset.index;
  card.classList.add("flipped");
  card.innerHTML = `<span class="emoji">${deck[index]}</span>`;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    const [first, second] = flippedCards;

    const res = await fetch("/memory/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        index1: first.dataset.index,
        index2: second.dataset.index
      })
    });

    const data = await res.json();
    coins = data.coins;
    tries = data.tries;

    updateCoins();
    updateTries();

    // If not a match, flip back
    if (!data.match) {
      setTimeout(() => {
        first.classList.remove("flipped");
        second.classList.remove("flipped");
        first.innerHTML = "";
        second.innerHTML = "";
      }, 600);
    }

    flippedCards = [];

    // Check if game finished
    const result = await fetch(`/api/memory/results/${userId}`);
    const resultData = await result.json();

    if (resultData.finished) {
      launchConfetti();
      await rewardUser(coins);
    }
  }
}

function updateCoins() {
  document.getElementById("coins-earned").textContent = `Coins Earned: ${coins}`;
}

function updateTries() {
  document.getElementById("tries-used").textContent = `Tries Used: ${tries}`;
}

// Confetti effect when finishing game
function launchConfetti() {
  const duration = 1500;
  const end = Date.now() + duration;

  (function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });

    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

startGame();