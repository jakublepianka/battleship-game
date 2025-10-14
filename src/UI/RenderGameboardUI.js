export const RenderGameboardUI = (playerName) => {
  const content = document.querySelector(".content");
  const gameContainer = document.createElement("div");
  const playerNameContainer = document.createElement("div");
  const playerNameText = document.createElement("h3");
  const resetButton = document.createElement("button");
  const gameboardContainer = document.createElement("div");

  gameContainer.classList.add("game-container");
  playerNameContainer.classList.add("player-name-container");
  playerNameText.classList.add("player-name-text");
  resetButton.classList.add("reset-button");
  gameboardContainer.classList.add("gameboard-container");
  playerNameText.textContent = `${playerName}`;
  resetButton.textContent = "Reset positions";
  gameContainer.id = `${playerName}`;
  gameboardContainer.id = `${playerName}`;
  resetButton.id = `${playerName}`;

  if (playerName === "Computer") gameContainer.style.order = "2";

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const square = document.createElement("div");
      square.classList.add("square");
      square.id = `[${i},${j}]`;
      gameboardContainer.appendChild(square);
    }
  }

  content.appendChild(gameContainer);
  gameContainer.appendChild(playerNameContainer);
  playerNameContainer.appendChild(playerNameText);
  if (playerName !== "Computer") playerNameContainer.appendChild(resetButton);
  gameContainer.appendChild(gameboardContainer);
};
