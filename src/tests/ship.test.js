/* eslint-disable no-undef */
import { Ship } from "../Core/Ship.js";

describe("Ship", () => {
  test("register hit", () => {
    const ship = Ship(4);
    ship.hit();
    expect(ship.stats.hitsTaken).toBe(1);
  });

  test("register if ship is sunk", () => {
    const ship = Ship(1);
    ship.hit();
    expect(ship.isSunk()).toBeTruthy();
  });
});
