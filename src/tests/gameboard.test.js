/* eslint-disable no-undef */
import { Gameboard } from "../gameboard.js";

test("place ship on gameboard horizontally", () => {
  const gameboard = Gameboard();
  gameboard.placeShip([0, 0], 3, true);
  const placedShip = gameboard.ships.get("[[0,0],[0,1],[0,2]]").stats;
  console.log(placedShip);
  expect(placedShip).toEqual({
    length: 3,
    hitsTaken: 0,
  });
});

test("place ship on gameboard vertically", () => {
  const gameboard = Gameboard();
  gameboard.placeShip([0, 0], 4, false);
  const placedShip = gameboard.ships.get("[[0,0],[1,0],[2,0],[3,0]]").stats;
  console.log(placedShip);
  expect(placedShip).toEqual({
    length: 4,
    hitsTaken: 0,
  });
});
