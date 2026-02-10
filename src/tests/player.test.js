/* eslint-disable no-undef */
import { Player } from "../Core/Player";

describe("Player", () => {
  let player;
  let receiverName = "player1";
  const mockGameActions = {
    sendAttack: jest.fn(),
  };

  function mockAttack(playerObj, sendAttack, receiver, expectedCoord) {
    const [x, y] = expectedCoord;
    playerObj.attack();
    jest.advanceTimersByTime(400);
    expectAttack(sendAttack, receiver, `[${x},${y}]`);
    playerObj.target = [x, y];
  }

  function expectAttack(sendAttack, receiver, coord) {
    expect(sendAttack).toHaveBeenCalledWith({
      receiver: receiver,
      coords: coord,
    });
  }

  function expectDynamicSpacingRandomAttack(playerObj, sendAttack, randVal, coord){
    jest.spyOn(Math, "random").mockReturnValue(randVal);
    playerObj.attack();
    jest.advanceTimersByTime(400);
    expect(sendAttack).toHaveBeenLastCalledWith({
      receiver: receiverName,
      coords: coord
    });
  }

  beforeEach(() => {
    player = Player("Computer", receiverName, true, mockGameActions);
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  test("Probes adjacent squares after it has hit a ship once", () => {
    player.hits = [[3, 4]];
    player.target = [3, 4];
    mockAttack(player, mockGameActions.sendAttack, receiverName, [2, 4]);
    mockAttack(player, mockGameActions.sendAttack, receiverName, [4, 4]);
    mockAttack(player, mockGameActions.sendAttack, receiverName, [3, 3]);
    mockAttack(player, mockGameActions.sendAttack, receiverName, [3, 5]);
  });

  test("attacks adjacent squares along the axis, when the axis is known", () => {
    player.hits = [[5, 2]];
    player.hits = [
      [5, 2],
      [5, 3],
    ];
    player.target = [5, 2];
    player.target = [5, 3];
    mockAttack(player, mockGameActions.sendAttack, receiverName, [5, 1]);
    mockAttack(player, mockGameActions.sendAttack, receiverName, [5, 4]);
  });

  test("attacks random squares using dynamic spacing algorithm", () => {
    expectDynamicSpacingRandomAttack(player, mockGameActions.sendAttack, 0, "[0,0]");
    expectDynamicSpacingRandomAttack(player, mockGameActions.sendAttack, 0.99, "[9,9]");
    expectDynamicSpacingRandomAttack(player, mockGameActions.sendAttack, 0.67, "[6,6]");
    expectDynamicSpacingRandomAttack(player, mockGameActions.sendAttack, 0.31, "[3,1]");
    player.hits = [[5, 2]];
    player.hits = [
      [5, 2],
      [5, 3],
    ];
    player.target = [5, 2];
    player.target = [5, 3];
    player.isSunk = true;
    expectDynamicSpacingRandomAttack(player, mockGameActions.sendAttack, 0, "[0,0]");
    expectDynamicSpacingRandomAttack(player, mockGameActions.sendAttack, 0.33, "[2,7]");
  });
});
