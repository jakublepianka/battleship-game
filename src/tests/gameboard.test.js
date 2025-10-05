/* eslint-disable no-undef */
import { Gameboard } from "../gameboard.js";

test("place ship on gameboard horizontally", () => {
  const gameboard = Gameboard();
  gameboard.placeShip([0, 0], 3, true);
  const placedShip = gameboard.ships.get("[[0,0],[0,1],[0,2]]").stats;
  expect(placedShip).toEqual({
    length: 3,
    hitsTaken: 0,
  });
});

test("place ship on gameboard vertically", () => {
  const gameboard = Gameboard();
  gameboard.placeShip([0, 0], 4, false);
  const placedShip = gameboard.ships.get("[[0,0],[1,0],[2,0],[3,0]]").stats;
  expect(placedShip).toEqual({
    length: 4,
    hitsTaken: 0,
  });
});

test("receive & register an attack", () => {
  const gameboard = Gameboard();
  gameboard.placeShip([0, 0], 4, false);
  gameboard.receiveAttack([3, 0]);
  expect(gameboard.ships.get("[[0,0],[1,0],[2,0],[3,0]]").stats).toEqual({
    length: 4,
    hitsTaken: 1,
  });
});

test("report whether all ships are sunk or not", () => {
  const gameboard = Gameboard();
  gameboard.placeShip([2,3], 1, false);
  gameboard.placeShip([5,6], 1, true);
  gameboard.receiveAttack([2, 3]);
  gameboard.receiveAttack([5,6]);
  expect(gameboard.areShipsSunk()).toBe(true);
  gameboard.placeShip([8,8], 1, true);
  expect(gameboard.areShipsSunk()).toBe(false);
});
