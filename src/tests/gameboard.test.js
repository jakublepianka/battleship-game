/* eslint-disable no-undef */
import { Gameboard } from "../gameboard.js";

describe("Gameboard", () => {

  const mockGameActions = {
    receiveAttack: jest.fn(),
    placeShip: jest.fn()
  };

  test("receiveAttack publishes correct attack info", () => {
    const gameboard = Gameboard("player1", mockGameActions);

    gameboard.receiveAttack([9,9]);

    expect(mockGameActions.receiveAttack).toHaveBeenCalledWith({
      receiver: "player1",
      missed: [[9,9]],
      hit: [],
      areSunk: true
    });
  });

  test("setNewShipPlacement publishes correct gameboard state", () => {
    const gameboard = Gameboard("player1", mockGameActions);

    gameboard.setNewShipPlacement();

    expect(mockGameActions.placeShip).toHaveBeenCalled();
    expect(mockGameActions.placeShip).toHaveBeenCalledWith(expect.objectContaining({
      publishedPlayer: "player1"
    }));

  });

  // test("placeShip places ships correctly", () => {
  //   const gameboard = Gameboard();
  //   gameboard.placeShip([9, 9], 4, false);
  //   const placedShip = gameboard.ships.get("[[9,9],[10,9],[11,9],[12,9]]");
  //   expect(placedShip).toBe(undefined);
  // });

  // test("receiveAttack causes ship to take a hit", () => {
  //   const gameboard = Gameboard();
  //   gameboard.placeShip([0, 0], 4, false);
  //   gameboard.receiveAttack([3, 0]);
  //   expect(gameboard.ships.get("[[0,0],[1,0],[2,0],[3,0]]").stats).toEqual({
  //     length: 4,
  //     hitsTaken: 1,
  //   });
  // });

  // test("placeShip on gameboard horizontally", () => {
  //   const gameboard = Gameboard();
  //   gameboard.placeShip([9, 9], 3, true);
  //   const placedShip = gameboard.ships.get("[[9,9],[9,8],[9,7]]").stats;
  //   expect(placedShip).toEqual({
  //     length: 3,
  //     hitsTaken: 0,
  //   });
  // });

  // test("placeShip on gameboard vertically", () => {
  //   const gameboard = Gameboard();
  //   gameboard.placeShip([9, 9], 4, false);
  //   const placedShip = gameboard.ships.get("[[9,9],[8,9],[7,9],[6,9]]").stats;
  //   expect(placedShip).toEqual({
  //     length: 4,
  //     hitsTaken: 0,
  //   });
  // });

  // test("getOffsetPlacement generates correct offset", () => {
  //   const gameboard = Gameboard();
  //   const shipWithOffset = gameboard.getOffsetPlacement([[0,0],[0,1]],[
  //     [-1, -1],[-1, 0],
  //     [-1, 1], [0, -1],
  //     [0, 1],  [1, -1],
  //     [1, 1],  [1, 0],
  //   ]);
  //   expect(shipWithOffset).toContainEqual([-1,-1]);
  //   expect(shipWithOffset).toContainEqual([1,2]);
  //   expect(shipWithOffset).toContainEqual([-1,2]);
  // });
});
