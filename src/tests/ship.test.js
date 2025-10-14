/* eslint-disable no-undef */
import { Ship } from "../Core/Ship.js"

test('register hit on ship', () => {
  const ship = Ship(4);
  ship.hit();
  expect(ship.stats.hitsTaken).toBe(1);
})

test('register if ship is sunk', () => {
  const ship = Ship(1)
  ship.hit();
  expect(ship.isSunk()).toBeTruthy();
})