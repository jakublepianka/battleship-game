import { eventBus } from "./eventBus.js";
import { RenderBaseLayout } from "./UI/RenderBaseLayout.js";
import { RenderDialog } from "./UI/RenderDialog.js";
import { GameMediator } from "./Controllers/GameMediator.js";
import "./css/normalize.css";
import "./css/layout.css";
import "./css/dialog.css";
import "./css/outcome.css";

RenderBaseLayout();

const mediator = GameMediator(eventBus);
RenderDialog(mediator);

// TODO
// allow another shot when hit?
// allow 2 human players
// computer algorithms
// drag&drop moving ships
// track wins/losses
