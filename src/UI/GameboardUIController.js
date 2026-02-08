export const GameboardUIController = (player, isComputer, uiActions) => {
  let hasBegun = false;
  const gameboardContainer = document.querySelector(
    `.gameboard-container` + `#${player}`,
  );

  const handleShipPlacement = (keys, publishedPlayer) => {
    if (player !== publishedPlayer) return;
    gameboardContainer.querySelectorAll(".square.ship").forEach((square) => {
      square.classList.remove("ship");
    });
    for (const key of keys) {
      let arr = JSON.parse(key);
      for (const coord of arr) {
        let safeId = `#\\[${coord[0]}\\,${coord[1]}\\]`;
        const el = gameboardContainer.querySelector(safeId);
        el.classList.add("ship");
      }
    }
  };

  const handleReceiveAttack = (receiver, missed, hit, sunkShip) => {
    if (receiver !== player) return;
    const defendersBoard = document.querySelector(
      `.gameboard-container` + `#${receiver}`,
    );
    refreshGameboard(missed, hit, sunkShip, defendersBoard);
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

  function refreshGameboard(missedArr, hitArr, sunkShipArr, gameboardEl) {
    changeSquareClass("missed", missedArr, gameboardEl);
    changeSquareClass("hit", hitArr, gameboardEl);
    changeSquareClass("sunk", sunkShipArr, gameboardEl);
  }

  function changeSquareClass(className, arr, gameboardEl) {
    for (const coord of arr) {
      let safeId = `#\\[${coord[0]}\\,${coord[1]}\\]`;
      const el = gameboardEl.querySelector(safeId);
      el.classList.add(className);
      if (className === "missed") el.textContent = "×";
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
