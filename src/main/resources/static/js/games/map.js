let coins = 0;
const goal = 55;
let currentLevel = 1;

const coinText = document.getElementById("coin-count");
const progressFill = document.getElementById("progress-fill");
const taskPanel = document.getElementById("task-panel");
const taskText = document.getElementById("task-text");
const btnA = document.getElementById("choice-a");
const btnB = document.getElementById("choice-b");

// Reward numbers array (for scaling)
const rewards = [5, 10, 15, 20, 25];

document.querySelectorAll(".node").forEach(node => {
    node.addEventListener("click", () => loadTask(parseInt(node.dataset.level)));

    node.addEventListener("mouseenter", async () => {
        const level = parseInt(node.dataset.level);
        if (!node.dataset.text) {
            try {
                const res = await fetch(`/api/spendquest/level/${level}`);
                const scenario = await res.json();
                node.dataset.text = scenario.text;
                node.dataset.diff = scenario.difficulty.toUpperCase()[0];
            } catch (error) {
                console.error("Failed to load task data:", error);
            }
        }
    });
});


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
async function loadTask(level) {
    const res = await fetch(`/api/spendquest/level/${level}`);
    const scenario = await res.json();

    const node = document.querySelector(`.node[data-level="${level}"]`);
    node.dataset.text = scenario.text;
    node.dataset.diff = scenario.difficulty.toUpperCase()[0];

    taskPanel.classList.remove("hidden");
    taskText.textContent = scenario.text;

    btnA.textContent = `${scenario.options[0].choice} (+${scenario.options[0].reward})`;
    btnB.textContent = `${scenario.options[1].choice} (+${scenario.options[1].reward})`;

    btnA.onclick = () => choose(scenario.options[0].reward, level);
    btnB.onclick = () => choose(scenario.options[1].reward, level);
}

function choose(reward, level) {
    coins += reward; // accumulate coins
    if (coins > goal) coins = goal; // cap at goal
    updateUI();
    completeLevel(level);
    taskPanel.classList.add("hidden");

    rewardUser(reward);

    // Check if all nodes are completed
    const allNodes = document.querySelectorAll(".node");
    const allCompleted = [...allNodes].every(n => n.classList.contains("completed"));
    if (allCompleted) openVault(); // vault opens only once at the end
}

function updateUI() {
    coinText.textContent = `Coins: ${coins} / ${goal}`;
    progressFill.style.width = Math.min((coins / goal) * 100, 100) + "%";
}

function completeLevel(level) {
    const node = document.querySelector(`.node[data-level="${level}"]`);
    node.classList.add("completed");
    if (level === currentLevel) currentLevel++;
}

function getRewardByCoins(coins) {
    const maxCoins = goal;
    const progressRatio = coins / maxCoins;
    const maxRewardIndex = rewards.length - 1;

    let rewardIndex = Math.floor(progressRatio * rewards.length);


    if (rewardIndex > maxRewardIndex) rewardIndex = maxRewardIndex;

    return rewards[rewardIndex];
}

function launchConfetti() {
    const duration = 1500;
    const end = Date.now() + duration;
    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < end) requestAnimationFrame(frame);
    })();
}

function openVault() {
    const overlay = document.getElementById("vault-overlay");
    const moneyBill = document.getElementById("money-bill");
    const rewardText = document.getElementById("reward-text");
    const rewardLabel = document.querySelector(".reward-label");
    const billSeal = document.querySelector(".bill-seal");
    const claimButton = document.getElementById("claim-reward");

    const earnedReward = getRewardByCoins(coins);

    rewardText.textContent = `${earnedReward} points!`;
    rewardLabel.style.display = "block";
    billSeal.style.display = "flex";
    moneyBill.classList.remove("success", "failed");
    moneyBill.classList.add("success");

    claimButton.textContent = "Claim Reward";
    launchConfetti();

    overlay.classList.remove("hidden");
    setTimeout(() => moneyBill.classList.add("show"), 100);
}

document.getElementById("claim-reward").onclick = () => {
    const rewardText = document.getElementById("reward-text").textContent;
    alert(`🎉 ${rewardText} added to your wallet!`);
    const overlay = document.getElementById("vault-overlay");
    const moneyBill = document.getElementById("money-bill");
    moneyBill.classList.remove("show", "success");
    setTimeout(() => overlay.classList.add("hidden"), 600);
};
