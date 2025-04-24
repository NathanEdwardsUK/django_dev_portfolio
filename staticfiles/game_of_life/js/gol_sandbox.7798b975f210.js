import { Canvas } from "./modules/canvas.js";
import { Game } from "./modules/game.js";
import { Board } from "./modules/board.js";
import { CONFIG } from "./modules/config.js";
import { PATTERNS } from "./modules/patterns.js";

let htmlBody = document.querySelector("body");
let htmlHeader = document.querySelector("header");
let htmlGameCanvas = document.getElementById("game-canvas");
let htmlPreviewCanvas = document.getElementById("preview-canvas");
let rotateButton = document.getElementById("rotate-button");
let runButton = document.getElementById("run-button");
let stopButton = document.getElementById("stop-button");
let clearButton = document.getElementById("clear-button");

let patternDropdown = document.getElementById("pattern-dropdown");
for (const pattern in PATTERNS) {
  patternDropdown.options.add(new Option(pattern, pattern));
}

const mainCanvas = new Canvas(
  htmlBody,
  htmlHeader,
  htmlGameCanvas,
  CONFIG.cellSize,
  CONFIG.aliveColor,
  CONFIG.deadColor
);

const game = new Game(
  mainCanvas,
  0.0,
  CONFIG.refreshInterval,
  CONFIG.initialState
);

window.addEventListener("resize", () => {
  game.triggerCanvasResize();
});

htmlGameCanvas.addEventListener("click", (event) => {
  game.handleCanvasClick(event);
});

htmlGameCanvas.addEventListener("mousemove", (event) => {
  game.handleMouseMove(event);
});

rotateButton.addEventListener("click", (event) => {
  game.rotateSelectedPattern();
  drawPreviewBox(game.getSelectedPattern());
});

runButton.addEventListener("click", (event) => {
  game.start();
});

stopButton.addEventListener("click", (event) => {
  game.pause();
});

clearButton.addEventListener("click", (event) => {
  game.clearBoard();
});

patternDropdown.addEventListener("change", (event) => {
  let pattern = PATTERNS[patternDropdown.value];

  if (!pattern) {
    htmlPreviewCanvas.style.display = "none";
    rotateButton.style.display = "none";
  } else {
    htmlPreviewCanvas.style.display = "block";
    rotateButton.style.display = "inline-block";
  }

  game.setSelectedPattern(pattern);
  drawPreviewBox(pattern);
});

function drawPreviewBox(pattern, canvas) {
  let boardSize = Math.max(pattern.length, pattern[0].length);
  let cellSize = htmlPreviewCanvas.height / boardSize;
  let previewCanvas = new Canvas(
    null,
    null,
    htmlPreviewCanvas,
    cellSize,
    CONFIG.aliveColor,
    "white"
  );
  let previewBoard = new Board(boardSize, boardSize, pattern, 0);
  let cells = previewBoard.getCells();
  previewCanvas.renderBoard(cells);
}

game.run();
