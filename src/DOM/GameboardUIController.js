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
        el.style.backgroundColor = "lightblue";
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
      el.textContent = "X";
    }
    for (const coord of hitArr) {
      let safeId = `#\\[${coord[0]}\\,${coord[1]}\\]`;
      const el = gameboardEl.querySelector(safeId);
      el.style.backgroundColor = "red";
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
