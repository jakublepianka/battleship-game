export const Player = (givenName, opponentName, isComputer, gameActions) => {
  const probingOffsets = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  const adjacentOffsets = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 1],
    [1, 0],
  ];
  let excludedCoords = [];
  let hits = [];
  let isCurrentTargetSunk = false;
  let shipsLeft = [5, 4, 3, 3, 2];

  function getRandomCoords(excluded) {
    let coord = [];
    while (coord.length < 2) {
      for (let i = 0; i < 2; i++) {
        coord.push(Math.floor(Math.random() * 10));
      }
      for (const excludedCoord of excluded) {
        if (sameCoords(coord, excludedCoord)) coord = [];
      }
    }
    return coord;
  }

  function publishAttack(attCoords) {
    setTimeout(() => {
      gameActions.sendAttack({
        receiver: opponentName,
        coords: attCoords,
      });
    }, 400);
  }

  function performAttack() {
    const isHorizontalAxis =
      hits.length > 1 ? isHorizontal(hits[0], hits[1]) : undefined;
    
    if (hits.length >= 2 && isCurrentTargetSunk){
      handleSunkShip(hits, excludedCoords, shipsLeft);
      isCurrentTargetSunk = false;
    }

    if (hits.length > 1) {
      finishShip(hits, shipsLeft, excludedCoords, isHorizontalAxis);
    } else if (hits.length === 1) {
      probeAdjacent(hits[0], excludedCoords);
    } else attackWithDynamicSpacing(shipsLeft, excludedCoords);
  }

  function finishShip(shipHits, remainingShips, excluded, isHorizontal) {
    const [minEdgeCoord, maxEdgeCoord] = getEdgeValues(shipHits, isHorizontal);
    const minString = toString(minEdgeCoord);
    const maxString = toString(maxEdgeCoord);
    if (!isBlockedCoord(minEdgeCoord, excluded))
      return publishAttack(minString);
    else if (!isBlockedCoord(maxEdgeCoord, excluded))
      return publishAttack(maxString);
    else return attackWithDynamicSpacing(remainingShips, excluded);
  }

  function probeAdjacent(lastHit, excluded) {
    let coord = [];
    for (let i = 0; i < probingOffsets.length; i++) {
      let currOffset = probingOffsets[i];
      coord = [lastHit[0] + currOffset[0], lastHit[1] + currOffset[1]];
      if (isBlockedCoord(coord, excluded)) {
        coord = getRandomCoords(excluded);
        continue;
      }
      break;
    }
    publishAttack(toString(coord));
  }

  function attackRandomSquare(excluded) {
    const randomCoords = getRandomCoords(excluded);
    publishAttack(toString(randomCoords));
  }

  function attackWithDynamicSpacing(remainingShips, excluded) {
    const smallestShip = Math.min(...remainingShips);
    const potentialCoords = [];
    for (let i = 0; i <= 9; i++) {
      for (let j = 0; j <= 9; j++) {
        if (
          (i + j) % smallestShip === 0 &&
          !hasBeenExcluded([i, j], excluded)
        ) {
          potentialCoords.push([i, j]);
        }
      }
    }
    if (potentialCoords.length > 0) {
      const randomIndex = Math.floor(Math.random() * potentialCoords.length);
      publishAttack(toString(potentialCoords[randomIndex]));
    } else attackRandomSquare(excluded);
  }

  function handleSunkShip(shipHits, excluded, remainingShips) {
    removeShip(shipHits.length, remainingShips);
    excludedCoords = excludeAdjacentCoords(shipHits, excluded);
    hits = [];
  }

  function excludeAdjacentCoords(shipCoords, excluded) {
    const coordsToExclude = [];
    for (const coord of shipCoords) {
      for (const offset of adjacentOffsets) {
        let coordToExclude = [coord[0] + offset[0], coord[1] + offset[1]];
        if (isBlockedCoord(coordToExclude, excluded)) continue;
        coordsToExclude.push(coordToExclude);
      }
    }
    return [...excludedCoords, ...coordsToExclude];
  }

  function getEdgeValues(shipHits, isHorizontal) {
    const variableIndex = isHorizontal ? 1 : 0;
    const constantIndex = isHorizontal ? 0 : 1;
    const constantVal = shipHits[0][constantIndex];
    const vals = shipHits.map((coord) => coord[variableIndex]);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const minEdgeCoord = getEdgeCoord("min", min, constantVal, isHorizontal);
    const maxEdgeCoord = getEdgeCoord("max", max, constantVal, isHorizontal);
    return [minEdgeCoord, maxEdgeCoord];
  }

  function getEdgeCoord(aggregate, val, axisVal, isHorizontal) {
    if (aggregate === "min") {
      return isHorizontal ? [axisVal, val - 1] : [val - 1, axisVal];
    } else if (aggregate === "max") {
      return isHorizontal ? [axisVal, val + 1] : [val + 1, axisVal];
    } else
      throw new Error("Invalid aggregate name: " + aggregate + " is invalid");
  }

  function isBlockedCoord(coord, excluded) {
    return isOutOfBounds(coord) || hasBeenExcluded(coord, excluded);
  }

  function removeShip(size, ships) {
    const i = ships.indexOf(size);
    if (i !== -1) {
      ships[i] = ships[ships.length - 1];
      ships.pop();
    }
  }

  function isHorizontal(arrOne, arrTwo) {
    return arrOne[0] === arrTwo[0];
  }

  function sameCoords(arrOne, arrTwo) {
    if (!arrOne || !arrTwo) return false;
    return arrOne[0] === arrTwo[0] && arrOne[1] === arrTwo[1];
  }

  function isOutOfBounds(coord) {
    if (coord[0] < 0 || coord[0] > 9 || coord[1] < 0 || coord[1] > 9)
      return true;
    return false;
  }

  function hasBeenExcluded(coord, excluded) {
    return excluded.some((excludedCoord) => sameCoords(excludedCoord, coord));
  }

  function toString(coord) {
    return `[${coord[0]},${coord[1]}]`;
  }

  return {
    set hits(value) {
      if (
        value.length > 0 &&
        !hits.some((coord) => sameCoords(coord, value.at(-1))) &&
        !hasBeenExcluded(value.at(-1), excludedCoords)
      )
        hits.push(value.at(-1));
    },
    set target(value) {
      excludedCoords.push(value);
    },
    set isSunk(value) {
      isCurrentTargetSunk = value;
    },
    attack: performAttack,
  };
};
