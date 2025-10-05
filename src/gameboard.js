import { Ship } from "./ship.js";

export const Gameboard = () => {
  const ships = new Map();
  const missedCoords = [];
  const hitCoords = [];

  function placeShip(coords, shipLength, isHorizontal) {
    const arr = isHorizontal
      ? getHorizontalCoords(coords, shipLength)
      : getVerticalCoords(coords, shipLength);
    let keyStr = JSON.stringify(arr);
    ships.set(keyStr, Ship(shipLength));
  }

  function getHorizontalCoords(coords, shipLength) {
    let arr = [];
    for (let i = coords[1]; i < shipLength + coords[1]; i++) {
      arr.push([coords[0], i]);
    }
    return arr;
  }

  function getVerticalCoords(coords, shipLength) {
    let arr = [];
    for (let i = coords[0]; i < shipLength + coords[0]; i++) {
      arr.push([i, coords[1]]);
    }
    return arr;
  }

  function receiveAttack(coords) {
    const hitShipKey = findHit(coords);
    if (hitShipKey) {
      ships.get(hitShipKey).hit();
      hitCoords.push(coords);
    } else {
      missedCoords.push(coords);
    }
  }

  function findHit(coords) {
    for (let key of ships.keys()) {
      if (key.includes(`${coords}`)) return key;
    }
    return false;
  }

  function areShipsSunk() {
    for (const ship of ships.values()) {
      if (!ship.isSunk()) return false;
    }
    return true;
  }

  return {
    ships,
    placeShip,
    receiveAttack,
    areShipsSunk,
  };
};
