export const Player = (givenName, opponentName, isComputer, gameActions) => {
  const name = isComputer ? "Computer" : givenName;
  const probingOffsets = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  let triedShots = [];
  let hits = [];
  // let sunkenCoords = [];
  // let misses = [];
  let shipsLeft = [5, 4, 3, 3, 2];

  function getRandomCoords(tried) {
    let coord = [];
    while (coord.length < 2) {
      for (let i = 0; i < 2; i++) {
        coord.push(Math.floor(Math.random() * 10));
      }
      for (const triedCoord of tried) {
        if (sameCoords(coord, triedCoord)) coord = [];
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

    evaluateCurrentHits(hits, triedShots, shipsLeft, isHorizontalAxis);

    if (hits.length > 1) {
      finishShip(hits, triedShots, isHorizontalAxis);
    } else if (hits.length === 1) {
      probeAdjacent(hits[0], triedShots);
    } else attackRandomSquare();
  }

  function finishShip(shipHits, tried, isHorizontal) {
    const [minEdgeCoord, maxEdgeCoord] = getEdgeValues(shipHits, isHorizontal);
    const minString = toString(minEdgeCoord);
    const maxString = toString(maxEdgeCoord);
    if (!isBlockedCoord(minEdgeCoord, tried)) return publishAttack(minString);
    if (!isBlockedCoord(maxEdgeCoord, tried)) return publishAttack(maxString);
    return attackRandomSquare();
  }

  function probeAdjacent(lastHit, tried) {
    let coord = [];
    for (let i = 0; i < probingOffsets.length; i++) {
      let currOffset = probingOffsets[i];
      coord = [lastHit[0] + currOffset[0], lastHit[1] + currOffset[1]];
      if (isBlockedCoord(coord, tried)) {
        coord = getRandomCoords(tried);
        continue;
      }
      break;
    }
    publishAttack(toString(coord));
  }

  function attackRandomSquare() {
    const randomCoords = getRandomCoords(triedShots);
    publishAttack(toString(randomCoords));
  }

  function evaluateCurrentHits(shipHits, tried, remainingShips, isHorizontal) {
    const hitCount = shipHits.length;
    if (hitCount < 2) return;
    if (
      hitCount === Math.max(...remainingShips) ||
      isSunkConfirmed(shipHits, tried, isHorizontal)
    ) {
      markShipSunk(hitCount, remainingShips);
      return true;
    } else return false;
  }

  function markShipSunk(hitCount, remainingShips) {
    removeShip(hitCount, remainingShips);
    // sunkenCoords = [...sunkenCoords, ...[shipHits]];
    hits = [];
  }

  function isSunkConfirmed(shipHits, tried, isHorizontal) {
    const [minEdgeCoord, maxEdgeCoord] = getEdgeValues(shipHits, isHorizontal);
    return (
      isBlockedCoord(minEdgeCoord, tried) && isBlockedCoord(maxEdgeCoord, tried)
    );
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

  function isBlockedCoord(coord, tried) {
    return isOutOfBounds(coord) || hasBeenTried(coord, tried);
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

  function hasBeenTried(coord, tried) {
    return tried.some((triedCoord) => sameCoords(triedCoord, coord));
  }

  function toString(coord){
    return `[${coord[0]},${coord[1]}]`;
  }

  return {
    set hits(value) {
      if (
        value.length > 0 &&
        !hits.some((coord) => sameCoords(coord, value.at(-1))) &&
        !hasBeenTried(value.at(-1), triedShots)
      )
        hits.push(value.at(-1));
    },
    // set misses(value) {
    //   misses = value;
    // },
    set target(value) {
      triedShots.push(value);
      // lastShot = value;
    },
    attack: performAttack,
  };
};
