import { Ship } from "./ship.js";

export const Gameboard = (playerName, gameActions) => {
  const player = playerName;
  const ships = new Map();
  const missedCoords = [];
  const hitCoords = [];
  const shipsToPlace = [2, 3, 3, 4, 5];
  const offsetValues = [
    [-1, -1],[-1, 0],
    [-1, 1], [0, -1],
    [0, 1],  [1, -1],
    [1, 1],  [1, 0],
  ];

  function placeShipsRandomly(shipsToPlace, offsetValues){
    const availableShips = [...shipsToPlace];
    const offsetPlacements = [];

    outer: while(availableShips.length !== 0){
      let randomCoord = getRandomCoord(offsetPlacements);
      let isHorizontal = Math.round(Math.random());
      let shipLength = availableShips.at(-1);
      let hypotheticalPlacement = isHorizontal 
        ? getHorizontalCoords(randomCoord, shipLength)
        : getVerticalCoords(randomCoord, shipLength);
      let currOffsetPlacement = getOffsetPlacement(hypotheticalPlacement, offsetValues);

      for (const coord of hypotheticalPlacement){
        if (offsetPlacements.some(occupiedCoord => JSON.stringify(occupiedCoord) === JSON.stringify(coord))) continue outer; 
      }
      for (const offsetCoord of currOffsetPlacement){
        offsetPlacements.push(offsetCoord);
      }
      placeShip(hypotheticalPlacement);
      availableShips.pop();
    }

  }

  function getRandomCoord(takenSpots){
    let arr = [];
    while(arr.length !== 2){
      for (let i = 0; i < 2; i++){
        arr.push(Math.floor(Math.random() * 10));
      }      
      for (const coord of takenSpots) {
        if (coord[0] === arr[0] && coord[1] === arr[1]){
          arr = [];
        };
      }
    }
    return arr;
  }

  function getHorizontalCoords(coords, shipLength) {
    const arr = [];
    for (let i = coords[1]; i < shipLength + coords[1]; i++) {
      if (isOutOfBounds([coords[0], i])){
        arr.push([coords[0], coords[1] - (i - 9)])
        continue;
      };
      arr.push([coords[0], i]);
    }
    return arr;
  }

  function getVerticalCoords(coords, shipLength) {
    const arr = [];
    for (let i = coords[0]; i < shipLength + coords[0]; i++) {
      if (isOutOfBounds([coords[0], i])){
        arr.push([coords[0] - (i - 9), coords[1]])
        continue;
      };
      arr.push([i, coords[1]]);
    }
    return arr;
  }

  function isOutOfBounds(coord) {
    if (coord[0] < 0 || coord[0] > 9 || coord[1] < 0 || coord[1] > 9) return true;
    return false;
  }

  function getOffsetPlacement(coordList, shipOffset){
   const arr = [];
    for (const coord of coordList) {
      for (const offset of shipOffset){
        let offsetCoord = [coord[0] + offset[0], coord[1] + offset[1]];
        if (arr.some(enteredCoord => JSON.stringify(enteredCoord) === JSON.stringify(offsetCoord))) continue;
        arr.push(offsetCoord);
      }
    }
    return arr;
  }

  function placeShip(coordList) {
    let shipLength = coordList.length;
    const keyStr = JSON.stringify(coordList);
    ships.set(keyStr, Ship(shipLength));
    publishShipPlacement();
  }

  function setNewShipPlacement(){
    ships.clear();
    placeShipsRandomly(shipsToPlace, offsetValues);
  }

  function receiveAttack(coords) {
    const hitShipKey = findHit(coords);

    if (hitShipKey) {
      ships.get(hitShipKey).hit();
      if (isDuplicate(hitCoords, coords)) return;
      hitCoords.push(coords);
    } else {
      if (isDuplicate(missedCoords, coords)) return;
      missedCoords.push(coords);
    }
    publishAttackInfo();
  }

  function findHit(coords) {
    for (const key of ships.keys()) {
      if (key.includes(`${coords}`)) return key;
    }
    return false;
  }

  function isDuplicate(arr, coords) {
    for (const coord of arr) {
      if (coord[0] === coords[0] && coord[1] === coords[1]) return true;
    }
    return false;
  }

  function areShipsSunk() {
    for (const ship of ships.values()) {
      if (!ship.isSunk()) return false;
    }
    return true;
  }

  function publishAttackInfo() {
    gameActions.receiveAttack({
      receiver: player,
      missed: missedCoords,
      hit: hitCoords,
      areSunk: areShipsSunk()
    });
  }

  function publishShipPlacement() {
    gameActions.placeShip({
      keys: ships.keys(),
      publishedPlayer: player,
    });
  }

  return {
    ships,
    setNewShipPlacement,
    receiveAttack,
    areShipsSunk,
  };
};
