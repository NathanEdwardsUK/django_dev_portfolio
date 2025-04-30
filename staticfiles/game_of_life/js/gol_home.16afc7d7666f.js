import { Canvas } from "./modules/canvas.js";
import { Game } from "./modules/game.js";
import { PATTERNS, WELCOME_MSG_STATE_MIN_2 } from "./modules/patterns.js";

const CONFIG = {
  cellSize: 5,
  minCellSize: 0.5,
  maxCellSize: 100,
  aliveColor: "rgb(0, 255, 42)",
  deadColor: "rgb(0, 0, 0)",
  refreshIntervalMs: 100,
  minRefreshIntervalMs: 5,
  maxRefreshIntervalMs: 2000,
  initialAliveProbability: 0.15,
  zoomSpeedFactor: 0.4
};

let canvasContainer = document.getElementById("gol-canvas-container");
let htmlCanvas = document.getElementById("gol-canvas");


const mainCanvas = new Canvas(
  null,
  null,
  htmlCanvas,
  CONFIG.cellSize,
  CONFIG.aliveColor,
  CONFIG.deadColor
);

const game = new Game(
  mainCanvas,
  0.0,
  CONFIG.refreshIntervalMs,

);

function getCanvasContainerDimensions() {
  return [canvasContainer.clientHeight, canvasContainer.clientWidth]
}

window.addEventListener("resize", () => {
  let [height, width] = getCanvasContainerDimensions();
  game.triggerCanvasResize(height, width);
});

let [height, width] = getCanvasContainerDimensions();

game.initNewGame(height, width);
game.start();

let boardHeight = height / CONFIG.cellSize;
let boardWidth = width / CONFIG.cellSize;

function insertPattern(pattern, x, y) {
  game.setSelectedPattern(pattern);
  game.insertBoardPatternAndRender(x, y, false);
}

let pattern;
let x;
let y;

pattern = PATTERNS["Gosper-glider-gun"];
x = - Math.round(Math.max(0.25 * boardWidth, pattern[0].length / 2 - 10));
y = Math.round(-0.3 * boardHeight)
insertPattern(pattern, x, y);

pattern = PATTERNS["Jason's P11"];
x = Math.round(Math.max(0.32 * boardWidth, pattern[0].length / 2 + 5));
y = Math.round(-0.1 * boardHeight)
insertPattern(pattern, x, y);

pattern = PATTERNS["Clock 2"];
x = Math.round(-0.3 * boardWidth);
y = Math.round(0.3 * boardHeight)
insertPattern(pattern, x, y);
