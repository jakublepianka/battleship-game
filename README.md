# Battleship Game
===============
[Preview](https://jakublepianka.github.io/battleship-game/)
A small Battleship implementation built with vanilla JavaScript, modular factories and an event-driven architecture. The project separates domain logic (Player, Gameboard, Ship), UI rendering/controllers, and a central coordinator (GameMediator) that orchestrates interactions.

## Key ideas
- Core (domain) modules (Ship, Gameboard, Player) contain game rules and expose a small public API.
- UI modules (RenderBaseLayout, RenderDialog, RenderGameboardUI, GameboardUIController, RenderOutcome) handle DOM rendering and user interactions.
- eventBus implements a lightweight pub/sub mechanism.
- GameMediator centralizes game lifecycle, component creation and coordination to reduce direct coupling between modules.

## Features
- Random ship placement (computer)
- Player name input dialog
- Click-to-attack UI
- Hits / misses display
- Reset positions and game restart flow
- Unit tests for core domain modules

## Project structure (important folders)
- src/
  - Core/ (domain)
    - Ship.js
    - Gameboard.js
    - Player.js
  - UI/ (DOM rendering + UI controllers)
    - RenderBaseLayout.js
    - RenderDialog.js
    - RenderGameboardUI.js
    - GameboardUIController.js
    - RenderOutcome.js
  - Controllers/
    - GameMediator.js (central coordinator)
  - tests/
    - ship.test.js
    - gameboard.test.js
  - eventBus.js
  - index.js
  - css/, assets/

## Naming and organization notes
- Domain files are named to match their exported factory (Ship, Gameboard, Player). Consider keeping them in a single folder (Core, domain or game) — this repo uses Core/.
- UI code lives in UI/ and controllers/mediators in Controllers/.
- Keep exported APIs minimal and explicit. The mediator should receive and hold references to created modules and call their public methods rather than making every module import the event bus.

## Architecture / mediator guidance (summary)
- GameMediator owns application state (players, gameboards, uiControllers) and registers eventBus subscriptions.
- Domain modules do not import eventBus directly. They receive a small actions object (gameActions) or expose methods the mediator calls.
- UI modules receive uiActions (thin publisher functions) and a minimal callback interface from the mediator. They expose simple methods such as listen(), stopListening(), handleReceiveAttack().
- Mediator normalizes payloads and orchestrates the flow: UI → mediator → domain → mediator → UI.

## Testing
- Unit tests live in src/tests and can be run with jest.
- Tests currently focus on Ship and Gameboard behavior. Add more as you extract logic from controllers/UI.
