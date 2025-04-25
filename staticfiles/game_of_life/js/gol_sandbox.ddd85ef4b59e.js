import { Canvas } from "./modules/canvas.js";
import { Game } from "./modules/game.js";
import { Board } from "./modules/board.js";
import { CONFIG } from "./modules/config.js";
import { PATTERNS, WELCOME_MSG_STATE_MIN_2 } from "./modules/patterns.js";

let body = document.querySelector("body");
let header = document.querySelector("header");
let htmlGameCanvas = document.getElementById("game-canvas");
let htmlPreviewCanvas = document.getElementById("preview-canvas");
// Settings box elements
let settingsBox = document.getElementById("settings-box");
let refreshIntervalSlider = document.getElementById("update-interval-slider");
let cellSizeSlider = document.getElementById("cell-size-slider");
// Control buttons
let settingsButton = document.getElementById("settings-gear");
let rotateButton = document.getElementById("rotate-button");
let startStopButton = document.getElementById("start-stop-button");
let clearButton = document.getElementById("clear-button");

// Create pattern selection dropdown menu
let patternDropdown = document.getElementById("pattern-dropdown");
for (const pattern in PATTERNS) {
  patternDropdown.options.add(new Option(pattern, pattern));
}

const mainCanvas = new Canvas(
  body,
  header,
  htmlGameCanvas,
  CONFIG.cellSize,
  CONFIG.aliveColor,
  CONFIG.deadColor
);

const game = new Game(
  mainCanvas,
  0.0,
  CONFIG.refreshInterval,
  WELCOME_MSG_STATE_MIN_2
);

window.addEventListener("resize", () => {
  game.triggerCanvasResize();
});

settingsButton.addEventListener("click", toggleSettingsVisibility);

refreshIntervalSlider.addEventListener("input", (event) => {
  game.setRefreshInterval(event.target.value);
});

cellSizeSlider.addEventListener("input", (event) => {
  game.setCellSize(event.target.value);
});

htmlGameCanvas.addEventListener("click", (event) => {
  game.handleCanvasClick(event);
});

htmlGameCanvas.addEventListener("mousemove", (event) => {
  game.handleMouseMove(event);
});

rotateButton.addEventListener("click", () => {
  game.rotateSelectedPattern();
  drawPreviewBox(game.getSelectedPattern(), htmlPreviewCanvas);
});

startStopButton.addEventListener("click", (event) => {
  if (startStopButton.textContent === "Start") {
    game.start();
    startStopButton.textContent = "Stop";
  } else {
    game.pause();
    startStopButton.textContent = "Start";
  }
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

function toggleSettingsVisibility() {
  if (settingsBox.style.display == "none") {
    settingsBox.style.display = "block";
  } else {
    settingsBox.style.display = "none";
  }
}

function drawPreviewBox(pattern) {
  let boardSize = Math.max(pattern.length, pattern[0].length);
  let cellSize = htmlPreviewCanvas.height / boardSize;
  let canvas = new Canvas(
    null,
    null,
    htmlPreviewCanvas,
    cellSize,
    CONFIG.aliveColor,
    "white"
  );
  let previewBoard = new Board(pattern, 0);
  let cells = previewBoard.getCells();
  canvas.renderBoard(cells);
}

game.initNewGame();
game.pause();
