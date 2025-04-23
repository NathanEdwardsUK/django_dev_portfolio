import { Canvas } from "./modules/canvas.js";
import { Game } from "./modules/game.js";
import { CONFIG } from "./modules/config.js";

let htmlBody = document.querySelector("body");
let htmlHeader = document.querySelector("header");
let htmlCanvas = document.getElementById("game-canvas");

const canvas = new Canvas(
  htmlBody,
  htmlHeader,
  htmlCanvas,
  CONFIG.cellSize,
  CONFIG.aliveColor,
  CONFIG.deadColor
);

const game = new Game(
  canvas,
  CONFIG.initialAliveProbability,
  CONFIG.refreshInterval,
  CONFIG.initialState
);

window.addEventListener("resize", () => {
  game.triggerCanvasResize();
});

game.run();

// game.board.insertArray(
//   CONFIG.initialState,
//   Math.round((game.board.boardWidth - WELCOME_MSG_STATE_MIN[0].length) / 2),
//   Math.round(game.board.boardHeight / 10)
// );
