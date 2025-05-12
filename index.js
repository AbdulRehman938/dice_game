const dice = document.querySelector(".dice");
const rollBtn = document.querySelector(".roll");
const currentUser = document.getElementById("currentUser");
let isRolling = false;
let outcomeCount = 0;
let player1Moves = 0;
let player2Moves = 0;
const maxMoves = 10;
let lastOutcome = null;
let player1Score = 0;
let player2Score = 0;
let player1Name = "";
let player2Name = "";
let gameHistory = JSON.parse(localStorage.getItem('diceGameHistory')) || [];
const statsHistoryBtn = document.getElementById('stats-history-btn');

// Dice animations for each number
const diceAnimations = {
  1: "rotateX(0deg) rotateY(0deg)",
  2: "rotateX(-90deg) rotateY(0deg)",
  3: "rotateX(0deg) rotateY(90deg)",
  4: "rotateX(0deg) rotateY(-90deg)",
  5: "rotateX(90deg) rotateY(0deg)",
  6: "rotateX(180deg) rotateY(0deg)",
};

document.addEventListener("DOMContentLoaded", function () {
  const player1Input = document.getElementById("p1-input");
  const player2Input = document.getElementById("p2-input");
  const player1Head = document.querySelector("#player1 #p1-head");
  const player2Head = document.querySelector("#player2 #p1-head");
  const message = document.querySelector(".message");
  const startModal = document.getElementById("start-modal");
  const startGameBtn = document.getElementById("start-game-btn");
  const modalContent = document.querySelector(".modal-content p");
  const turnMessage = document.createElement("p");
  turnMessage.className = "turn-message";
  document.querySelector(".container").insertBefore(turnMessage, dice);

  // Create containers for remaining moves
  const player1MovesContainer = document.createElement("p");
  player1MovesContainer.className = "moves-container";
  player1MovesContainer.textContent = `Remaining Moves: ${maxMoves}`;
  player1Input.parentNode.appendChild(player1MovesContainer);

  const player2MovesContainer = document.createElement("p");
  player2MovesContainer.className = "moves-container";
  player2MovesContainer.textContent = `Remaining Moves: ${maxMoves}`;
  player2Input.parentNode.appendChild(player2MovesContainer);

  const player1ScoreCard = document.createElement("div");
  player1ScoreCard.className = "score-card";
  player1ScoreCard.textContent = `${player1Name} score : 0`;
  document.querySelector("#player1").appendChild(player1ScoreCard);

  const player2ScoreCard = document.createElement("div");
  player2ScoreCard.className = "score-card";
  player2ScoreCard.textContent = `${player2Name} score : 0`;
  document.querySelector("#player2").appendChild(player2ScoreCard);

  // Create a message to show which player is winning
  const winningMessage = document.createElement("p");
  winningMessage.className = "winning-message";
  winningMessage.textContent = "";
  winningMessage.style.display = "none";
  winningMessage.style.justifyContent = "center";
  document.querySelector(".container").appendChild(winningMessage);

  let player1NameEntered = false;
  let player2NameEntered = false;

  // Hide the modal initially
  startModal.style.display = "none";

  // Show stats button if there's any game history
  if (gameHistory.length > 0) {
    statsHistoryBtn.style.display = 'block';
  } else {
    statsHistoryBtn.style.display = 'none';
  }

  // Function to validate player names
  const validatePlayerNames = (name1, name2) => {
    return true;
  };

  const checkNamesEntered = () => {
    if (player1NameEntered && player2NameEntered) {
      modalContent.textContent = `Hello ${player1Name} and ${player2Name}, let's start the game!`;
      startModal.style.display = "flex";
    } else {
      rollBtn.style.display = "none";
      dice.style.display = "none";
      message.style.display = "block";
    }
  
    player1MovesContainer.style.display = "none";
    player2MovesContainer.style.display = "none";
  };

  const updateTurnMessage = () => {
    if (player1Moves >= maxMoves && player2Moves >= maxMoves) {
      turnMessage.textContent = "Game Over";
      endGame();
    } else if ((player1Moves + player2Moves) % 2 === 0) {
      turnMessage.textContent = `${player1Name}'s turn`;
    } else {
      turnMessage.textContent = `${player2Name}'s turn`;
    }
  };

  const updateWinningMessage = () => {
    if (player1NameEntered && player2NameEntered) {
      winningMessage.style.display = "block";
      if (player1Score > player2Score) {
        winningMessage.textContent = `${player1Name} is winning!`;
      } else if (player2Score > player1Score) {
        winningMessage.textContent = `${player2Name} is winning!`;
      } else {
        winningMessage.textContent = "It's a tie!";
      }
    }
  };

  function saveGameStats() {
    // Check if this game has already been saved
    const currentGame = {
      player1: { name: player1Name, score: player1Score },
      player2: { name: player2Name, score: player2Score }
    };

    const isDuplicate = gameHistory.some(game => 
      game.player1.name === currentGame.player1.name &&
      game.player2.name === currentGame.player2.name &&
      game.player1.score === currentGame.player1.score &&
      game.player2.score === currentGame.player2.score
    );

    if (!isDuplicate) {
      const gameStats = {
        date: new Date().toLocaleString(),
        player1: {
          name: player1Name,
          score: player1Score,
          moves: Array.from(document.getElementById("player1-moves").children).map(el => el.textContent.trim())
        },
        player2: {
          name: player2Name,
          score: player2Score,
          moves: Array.from(document.getElementById("player2-moves").children).map(el => el.textContent.trim())
        },
        winner: player1Score > player2Score ? player1Name : player2Score > player1Score ? player2Name : "Tie"
      };
      
      gameHistory.unshift(gameStats);
      localStorage.setItem('diceGameHistory', JSON.stringify(gameHistory));
      statsHistoryBtn.style.display = 'block';
    }
  }

  function showStatsHistory() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'stats-overlay';
    overlay.style.display = 'block';
    
    // Create stats container
    const statsContainer = document.createElement('div');
    statsContainer.className = 'stats-history-container';
    statsContainer.style.display = 'block';
    
    if (gameHistory.length === 0) {
      statsContainer.innerHTML = `
        <div class="stats-content">
          <h2>Stats History</h2>
          <p>No previous games found</p>
        </div>
      `;
    } else {
      statsContainer.innerHTML = `
        <div class="stats-content">
          <h2>Stats History</h2>
          <button id="clear-history-btn">Clear History</button>
          <div class="stats-scroll-container">
            ${gameHistory.map((game, index) => `
              <div class="game-stats">
                <p class="game-header"><strong>Game ${index + 1}</strong> - ${game.date}</p>
                <p class="winner">Winner: <span>${game.winner}</span></p>
                <div class="player-stats">
                  <div class="player-stat">
                    <p class="player-name">${game.player1.name}</p>
                    <p class="player-score">Score: ${game.player1.score}</p>
                    <div class="moves-title">Moves:</div>
                    <ul class="moves-list">
                      ${game.player1.moves.map(move => `<li>${move}</li>`).join('')}
                    </ul>
                  </div>
                  <div class="player-stat">
                    <p class="player-name">${game.player2.name}</p>
                    <p class="player-score">Score: ${game.player2.score}</p>
                    <div class="moves-title">Moves:</div>
                    <ul class="moves-list">
                      ${game.player2.moves.map(move => `<li>${move}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      
      // Clear history button functionality
      statsContainer.querySelector('#clear-history-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to clear all game history?')) {
          localStorage.removeItem('diceGameHistory');
          gameHistory = [];
          statsHistoryBtn.style.display = 'none';
          overlay.style.display = 'none';
          statsContainer.style.display = 'none';
          document.body.removeChild(overlay);
          document.body.removeChild(statsContainer);
        }
      });
    }
    
    // Close when clicking anywhere
    const closeStats = () => {
      overlay.style.display = 'none';
      statsContainer.style.display = 'none';
      document.body.removeChild(overlay);
      document.body.removeChild(statsContainer);
    };
    
    overlay.addEventListener('click', closeStats);
    statsContainer.addEventListener('click', (e) => {
      if (e.target === statsContainer || e.target.classList.contains('stats-content')) {
        closeStats();
      }
    });
    
    document.body.appendChild(overlay);
    document.body.appendChild(statsContainer);
  }

  // Add click event for stats history button
  statsHistoryBtn.addEventListener('click', showStatsHistory);

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "Enter") {
      if (player1NameEntered && player2NameEntered) {
        randomDice();
      }
    }
  });

  const randomDice = () => {
    if (isRolling) return;
    isRolling = true;

    rollBtn.style.display = "block";

    let random;
    do {
      random = Math.floor(Math.random() * 6) + 1;
    } while (random === lastOutcome);

    lastOutcome = random;
    rollDice(random);
  };

  const rollDice = (random) => {
    dice.style.animation = "rolling 4s cubic-bezier(0.25, 0.1, 0.25, 1) forwards";

    setTimeout(() => {
      dice.style.animation = "none";
      dice.style.transition = "transform 1s ease-out";
      dice.style.transform = diceAnimations[random];

      updateScore(random);
      isRolling = false;
      rollBtn.style.display = "block";
      rollBtn.innerHTML = 'Press <span id="btn-main-text">spacebar</span> or <span id="btn-main-text"> enter key </span> <br> to roll dice';
      rollBtn.style.backgroundColor = "";
      rollBtn.style.color = "";
      updateTurnMessage();
      updateWinningMessage();
    }, 4000);
  };

  const updateScore = (outcome) => {
    outcomeCount++;
    if (outcomeCount % 2 === 1) {
      if (player1Moves < maxMoves) {
        player1Moves++;
        player1Score += outcome;
        player1ScoreCard.textContent = `${player1Name}'s total score: ${player1Score}`;
        player1MovesContainer.textContent = `Remaining Moves: ${maxMoves - player1Moves}`;

        const moveElement = document.createElement("div");
        moveElement.innerHTML = `<p style="font-size: 2rem; color:rgb(10, 10, 10);">${player1Moves}: ${outcome}</p>`;
        document.getElementById("player1-moves").appendChild(moveElement);
      }
    } else {
      if (player2Moves < maxMoves) {
        player2Moves++;
        player2Score += outcome;
        player2ScoreCard.textContent = `${player2Name}'s total score: ${player2Score}`;
        player2MovesContainer.textContent = `Remaining Moves: ${maxMoves - player2Moves}`;

        const moveElement = document.createElement("div");
        moveElement.innerHTML = `<p style="font-size: 2rem; color:rgb(2, 59, 116);"> ${player2Moves}: ${outcome} </p>`;
        document.getElementById("player2-moves").appendChild(moveElement);
      }
    }

    if (player1Moves >= maxMoves && player2Moves >= maxMoves) {
      rollBtn.disabled = true;
      endGame();
    }
  };

  const endGame = () => {
    dice.style.display = "none";
    rollBtn.style.display = "none";

    saveGameStats();

    const gameOverContainer = document.createElement("div");
    gameOverContainer.className = "game-over-container";
    gameOverContainer.innerHTML = `
      <h2>Game Over</h2>
      <div id="players-stats">
        <p id="player1-stats">${player1Name}: ${player1Score}</p>
        <p id="player2-stats">${player2Name}: ${player2Score}</p>
      </div>
      <p>${
        player1Score > player2Score 
          ? `${player1Name} wins!` 
          : player2Score > player1Score 
          ? `${player2Name} wins!` 
          : "It's a tie!"
      }</p>
      <button id="restart-btn">Play Again</button>
    `;
    document.body.appendChild(gameOverContainer);

    document.addEventListener("click", (event) => {
      if (event.target && event.target.id === "restart-btn") {
        window.location.reload();
      }
    });
  };

  player1Input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      const name1 = player1Input.value.trim();
      const name2 = player2Input.value.trim();

      if (!validatePlayerNames(name1, name2)) {
        location.reload();
        return;
      }

      player1Name = name1;
      const playerNameElement = document.createElement("p");
      playerNameElement.textContent = player1Name;
      playerNameElement.style.color = "white";
      playerNameElement.style.fontSize = "4rem";
      playerNameElement.style.marginTop = "3rem";
      player1Input.style.display = "none";
      player1Head.style.display = "none";
      player1Input.parentNode.appendChild(playerNameElement);
      player1NameEntered = true;
      player1ScoreCard.textContent = `${player1Name}: 0`;
      checkNamesEntered();
    }
  });

  player2Input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      const name1 = player1Input.value.trim();
      const name2 = player2Input.value.trim();

      if (!validatePlayerNames(name1, name2)) {
        location.reload();
        return;
      }

      player2Name = name2;
      const playerNameElement = document.createElement("p");
      playerNameElement.textContent = player2Name;
      playerNameElement.style.color = "white";
      playerNameElement.style.fontSize = "4rem";
      playerNameElement.style.marginTop = "3rem";
      player2Input.style.display = "none";
      player2Head.style.display = "none";
      player2Input.parentNode.appendChild(playerNameElement);
      player2NameEntered = true;
      player2ScoreCard.textContent = `${player2Name}: 0`;
      checkNamesEntered();
    }
  });

  startGameBtn.addEventListener("click", () => {
    if (player1NameEntered && player2NameEntered) {
      startModal.style.display = "none";
      rollBtn.style.display = "block";
      dice.style.display = "block";
      message.style.display = "none";
      player1MovesContainer.style.display = "block";
      player2MovesContainer.style.display = "block";
      updateTurnMessage();
      dice.style.animation = "none";
    }
  });

  // Smooth drag functionality for the dice
  let isDragging = false;
  let startX, startY;
  let currentRotationX = 0;
  let currentRotationY = 0;

  dice.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  dice.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      currentRotationX -= deltaY * 1.5;
      currentRotationY += deltaX * 1.5;

      dice.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;

      startX = e.clientX;
      startY = e.clientY;
    }
  });

  dice.addEventListener("mouseup", () => {
    isDragging = false;
  });

  dice.addEventListener("mouseleave", () => {
    isDragging = false;
  });

  checkNamesEntered();
});

let logout = document.querySelector(".login-btn");
logout.addEventListener("click", () => {
  window.location.href = "/index.html";
  localStorage.removeItem("token");
});