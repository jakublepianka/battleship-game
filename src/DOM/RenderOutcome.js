export const RenderOutcome = (playerName, mainActions) => {
  const contentContainer = document.querySelector(".content");
  const outcomeContainer = document.createElement("div");
  const outcomeText = document.createElement("h1");
  const restartButton = document.createElement("button");

  outcomeContainer.classList.add("outcome-container");
  outcomeText.classList.add("outcome-text");
  restartButton.classList.add("restart-button");
  if (playerName === "Computer") {
    outcomeText.textContent = "You win!";
  } else {
    outcomeText.textContent = "You lose!";
  }
  restartButton.textContent = "Play again";

  restartButton.addEventListener("click", () => {
    contentContainer.replaceChildren();
    mainActions.restartGame();
  });

  contentContainer.appendChild(outcomeContainer);
  outcomeContainer.appendChild(outcomeText);
  outcomeContainer.appendChild(restartButton);

};
