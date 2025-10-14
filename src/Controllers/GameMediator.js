import { RenderGameboardUI } from "../DOM/RenderGameboardUI.js";
import { GameboardUIController } from "../DOM/GameboardUIController.js";
import { Player } from "../player.js";
import { Gameboard } from "../gameboard.js";
import { RenderOutcome } from "../DOM/RenderOutcome.js";

export const GameMediator = (eventBus) => {
  const EVENTS = {
    ATTACK_SENT: "attackSent",
    ATTACK_RECEIVED: "attackReceived",
    SHIP_PLACED: "shipPlaced",
    BOARD_REFRESHED: "boardRefreshed",
    POSITIONS_RESET: "positionsReset",
    GAME_RESTARTED: "gameRestarted",
  };
  let state = {
    players: new Map(),
    gameboards: new Map(),
    uiControllers: new Map(),
    isOver: false,
  };
  const gameActions = {
    sendAttack: (data) => eventBus.publish(EVENTS.ATTACK_SENT, data),
    receiveAttack: (data) => eventBus.publish(EVENTS.ATTACK_RECEIVED, data),
    placeShip: (data) => eventBus.publish(EVENTS.SHIP_PLACED, data),
  };
  const uiActions = {
    refreshBoard: (data) => eventBus.publish(EVENTS.BOARD_REFRESHED, data),
    resetPositions: (data) => eventBus.publish(EVENTS.POSITIONS_RESET, data),
    sendAttack: (data) => eventBus.publish(EVENTS.ATTACK_SENT, data),
  };
  const mainActions = {
    restartGame: (data) => eventBus.publish(EVENTS.GAME_RESTARTED, data),
  };
  const onShipPlaced = ({ keys, publishedPlayer }) => {
    if (publishedPlayer === "Computer") return;
    state.uiControllers
      .get(publishedPlayer)
      .handleShipPlacement(keys, publishedPlayer);
  };
  const onPositionsReset = ({ name }) => {
    state.gameboards.get(name).setNewShipPlacement();
  };
  const onAttackSent = ({ receiver, coords }) => {
    state.gameboards.get(receiver).receiveAttack(JSON.parse(coords));
  };
  const onAttackReceived = ({ receiver, missed, hit, areSunk }) => {
    state.uiControllers
      .get(receiver)
      .handleReceiveAttack(receiver, missed, hit);
    if (areSunk) {
      state.isOver = true;
      RenderOutcome(receiver, mainActions);
      state.uiControllers.get(receiver).stopListening();
      return;
    }
    if (state.isOver) return;
    if (receiver === "Computer") {
      state.players.get("Computer").attackRandomSquare();
    }
    if (receiver !== "Computer") {
      const computer = state.players.get("Computer");
      computer.hits = hit;
      computer.misses = missed;
      state.uiControllers.get("Computer").listen();
    }
  };
  const onGameRestarted = () => {
    const humanName = state.players.keys().find((key) => key !== "Computer");
    destroy();
    startGame(humanName);
  };

  const subscriptions = [];
  const registerSubscriptions = () => {
    if (subscriptions.length > 0) return;
    subscriptions.push([EVENTS.SHIP_PLACED, onShipPlaced]);
    subscriptions.push([EVENTS.POSITIONS_RESET, onPositionsReset]);
    subscriptions.push([EVENTS.ATTACK_SENT, onAttackSent]);
    subscriptions.push([EVENTS.ATTACK_RECEIVED, onAttackReceived]);
    subscriptions.push([EVENTS.GAME_RESTARTED, onGameRestarted]);

    for (const [name, handler] of subscriptions) {
      eventBus.subscribe(name, handler);
    }
  };

  // const unregisterSubscriptions = () => {
  //   for (const [name, handler] of subscriptions) {
  //     eventBus.unsubscribe(name, handler);
  //   }
  // };

  const initializeUI = (name, isComputer) => {
    RenderGameboardUI(name);
    state.uiControllers.set(
      name,
      GameboardUIController(name, isComputer, uiActions),
    );
  };

  const createPlayersAndBoards = (name) => {
    state.players.set(name, Player(name, "Computer", false, gameActions));
    state.players.set("Computer", Player("Computer", name, true, gameActions));

    state.gameboards.set(name, Gameboard(name, gameActions));
    state.gameboards.set("Computer", Gameboard("Computer", gameActions));
  };

  const startGame = (playerName) => {
    registerSubscriptions();

    createPlayersAndBoards(playerName);

    initializeUI(playerName, false);
    initializeUI("Computer", true);

    state.gameboards.get(playerName).setNewShipPlacement();
    state.gameboards.get("Computer").setNewShipPlacement();

    state.uiControllers.get("Computer").listen();
  };

  const destroy = () => {
    state.players.clear();
    state.gameboards.clear();
    state.uiControllers.clear();
    state.isOver = false;
  };

  return {
    onNameChosen: startGame,
    destroy,
  };
};
