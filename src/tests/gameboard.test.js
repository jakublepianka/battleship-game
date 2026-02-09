/* eslint-disable no-undef */
import { Gameboard } from "../Core/Gameboard.js";

describe("Gameboard", () => {
  let gameboard;
  const mockGameActions = {
    sendAttack: jest.fn(),
    receiveAttack: jest.fn(),
    placeShip: jest.fn(),
  };

  function isOutOfBounds(coordKeys) {
    for (const coordKey of coordKeys) {
      if (/-?\d{2,}|-\d/.test(coordKey)) return true;
    }
    return false;
  }

  function sinkAllShips(coordKeys, gameboard) {
    for (const coordKey of coordKeys) {
      let coordList = JSON.parse(coordKey);
      for(let i = 0; i < coordList.length; i++) {
        gameboard.receiveAttack(coordList[i]);
      }
    }
  }

  function sinkSpecificShip(coordList, gameboard) {
    for (let i = 0; i < coordList.length; i++) {
      gameboard.receiveAttack(coordList[i]); 
    }
  }

  beforeEach(() => {
    gameboard = Gameboard("player1", mockGameActions);
    jest.clearAllMocks();
  });

  test("receiveAttack publishes missed attack info", () => {
    gameboard.receiveAttack([9, 9]);
    expect(mockGameActions.receiveAttack).toHaveBeenCalledWith({
      receiver: "player1",
      missed: [[9, 9]],
      hit: [],
      target: [9, 9],
      sunkShip: [],
      areSunk: true,
    });
  });

  test("setNewShipPlacement places ships within gameboard bounds", () => {
    gameboard.setNewShipPlacement();
    expect(mockGameActions.placeShip).toHaveBeenCalled();
    const coordKeys = mockGameActions.placeShip.mock.calls[0][0].keys;
    expect(isOutOfBounds(coordKeys)).toBe(false);
  });

  test("receiveAttack publishes hit attack info", () => {
    gameboard.setNewShipPlacement();
    const coordKeys = mockGameActions.placeShip.mock.calls[0][0].keys;
    const coordKey = coordKeys.next().value;
    const coordList = JSON.parse(coordKey);
    const coordOne = coordList[0];
    const coordTwo = coordList[1];
    gameboard.receiveAttack(coordOne);
    gameboard.receiveAttack(coordTwo);
    expect(mockGameActions.receiveAttack).toHaveBeenCalledWith(
      expect.objectContaining({
        hit: [coordOne, coordTwo],
        target: coordTwo,
      }),
    );
  });

  test("receiveAttack doesn't publish attack when same coord is attacked twice", () => {
    gameboard.setNewShipPlacement();
    const coordKeys = mockGameActions.placeShip.mock.calls[0][0].keys;
    const coordKey = coordKeys.next().value;
    const coordList = JSON.parse(coordKey);
    const coordOne = coordList[0];
    gameboard.receiveAttack(coordOne);
    gameboard.receiveAttack(coordOne);
    expect(mockGameActions.receiveAttack).toHaveBeenCalledWith(
      expect.objectContaining({
        hit: [coordOne],
        target: coordOne,
      }),
    );
  });

  test("receiveAttack informs when all ships are sunk", () => {
    gameboard.setNewShipPlacement();
    const coordKeys = mockGameActions.placeShip.mock.calls[0][0].keys;
    sinkAllShips(coordKeys, gameboard);
    expect(mockGameActions.receiveAttack).toHaveBeenLastCalledWith(
      expect.objectContaining({
        areSunk: true,
      }),
    );
  });

  test("receiveAttack sends coords of a sunken ship when it is sunk", () => {
    gameboard.setNewShipPlacement();
    const coordKeys = mockGameActions.placeShip.mock.calls[0][0].keys;
    const coordKey = coordKeys.next().value;
    const coordList = JSON.parse(coordKey);
    sinkSpecificShip(coordList, gameboard);
    expect(mockGameActions.receiveAttack).toHaveBeenLastCalledWith(
      expect.objectContaining({
        sunkShip: coordList,
      }),
    );
  });
});
