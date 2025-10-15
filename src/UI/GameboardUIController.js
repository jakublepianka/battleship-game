export const GameboardUIController = (player, isComputer, uiActions) => {
  let hasBegun = false;
  const gameboardContainer = document.querySelector(
    `.gameboard-container` + `#${player}`,
  );

  const handleShipPlacement = (keys, publishedPlayer) => {
    if (player !== publishedPlayer) return;
    gameboardContainer.querySelectorAll(".square").forEach((square) => {
      if (square.style.backgroundColor !== "") square.removeAttribute("style");
    });
    for (const key of keys) {
      let arr = JSON.parse(key);
      for (const coord of arr) {
        let safeId = `#\\[${coord[0]}\\,${coord[1]}\\]`;
        const el = gameboardContainer.querySelector(safeId);
        el.style.backgroundColor = "rgb(148, 148, 148)";
        el.style.border = "4px solid rgb(100,100,100)";
      }
    }
  };

  const handleReceiveAttack = (receiver, missed, hit) => {
    if (receiver !== player) return;
    const defendersBoard = document.querySelector(
      `.gameboard-container` + `#${receiver}`,
    );
    refreshGameboard(missed, hit, defendersBoard);
    stopListening();

    if (!hasBegun) {
      hasBegun = true;
      removeResetButton();
    }
  };

  const removeResetButton = () => {
    const parents = document.querySelectorAll(`.player-name-container`);
    parents.forEach((parent) => {
      const resetButton = parent.querySelector(`.reset-button`);
      if (resetButton !== null) {
        parent.removeChild(resetButton);
      }
    });
  };

  if (!isComputer) {
    addResetButton();
  }

  function addResetButton() {
    const resetButton = document.querySelector(`.reset-button` + `#${player}`);
    resetButton.addEventListener("click", (e) => {
      uiActions.resetPositions({
        name: e.target.id,
      });
    });
  }

  function listen() {
    const squares = gameboardContainer.querySelectorAll(".square");
    squares.forEach((square) => {
      square.addEventListener("click", (e) => {
        publishAttack(player, e.target.id);
      });
    });
  }

  function publishAttack(player, attCoords) {
    uiActions.sendAttack({
      receiver: player,
      coords: attCoords,
    });
  }

  function stopListening() {
    const squares = gameboardContainer.querySelectorAll(".square");
    squares.forEach((square) => {
      const newSquare = square.cloneNode(true);
      square.replaceWith(newSquare);
    });
  }

  function refreshGameboard(missedArr, hitArr, gameboardEl) {
    for (const coord of missedArr) {
      let safeId = `#\\[${coord[0]}\\,${coord[1]}\\]`;
      const el = gameboardEl.querySelector(safeId);
      el.classList.add("missed");
      el.textContent = "×";
    }
    for (const coord of hitArr) {
      let safeId = `#\\[${coord[0]}\\,${coord[1]}\\]`;
      const el = gameboardEl.querySelector(safeId);
      el.classList.add("hit");
      el.style.backgroundColor = "rgba(232, 53, 53, 1)";
      el.style.border = "2px solid rgb(100,100,100)";
      el.style.boxShadow = "inset 0 0 5px 2px rgb(100,100,100)";
    }
  }

  return {
    listen,
    stopListening,
    handleShipPlacement,
    handleReceiveAttack,
    refreshGameboard,
  };
};
