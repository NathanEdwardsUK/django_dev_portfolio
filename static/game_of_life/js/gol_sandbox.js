import { Canvas } from "./modules/canvas.js";
import { Game } from "./modules/game.js";
import { Board } from "./modules/board.js";
import { PATTERNS, WELCOME_MSG_STATE_MIN_2 } from "./modules/patterns.js";

export const CONFIG = {
  cellSize: 10,
  minCellSize: 0.5,
  maxCellSize: 100,
  aliveColor: "rgb(0, 0, 0)",
  deadColor: "rgb(253, 246, 237)",
  refreshIntervalMs: 100,
  minRefreshIntervalMs: 5,
  maxRefreshIntervalMs: 2000,
  initialAliveProbability: 0.15,
};

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
let runStopButton = document.getElementById("run-stop-button");
let stepButton = document.getElementById("step-button");
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
  CONFIG.refreshIntervalMs,
  WELCOME_MSG_STATE_MIN_2
);

window.addEventListener("resize", () => {
  game.triggerCanvasResize();
});

settingsButton.addEventListener("click", toggleSettingsVisibility);

function logSlider(minValue, maxValue, newValue) {
  // Allows a slider to linearly control a non linear variable by
  // logarithmically rescaling
  let minLogValue = Math.log(minValue);
  let maxLogValue = Math.log(maxValue);
  let scale = (maxLogValue - minLogValue) / 100;
  let newLogValue = minLogValue + newValue * scale;

  return Math.exp(newLogValue);
}

function inverseLogSlider(minValue, maxValue, currentValue) {
  // Inverts the logSlider function by converting a value into a percentage
  let currentLogValue = Math.log(currentValue);
  let minLogValue = Math.log(minValue);
  let maxLogValue = Math.log(maxValue);
  let scale = (maxLogValue - minLogValue) / 100;
  let percentageValue = (currentLogValue - minLogValue) / scale;
  return percentageValue;
}

let minUpdatesPerS = 1000 / CONFIG.maxRefreshIntervalMs;
let maxUpdatesPerS = 1000 / CONFIG.minRefreshIntervalMs;

// Set the settings slider positions based on CONFIG values
function setSliderStartPositions() {
  refreshIntervalSlider.value = inverseLogSlider(
    minUpdatesPerS,
    maxUpdatesPerS,
    1000 / CONFIG.refreshIntervalMs
  );

  cellSizeSlider.value = inverseLogSlider(
    CONFIG.minCellSize,
    CONFIG.maxCellSize,
    CONFIG.cellSize
  );
}

setSliderStartPositions();

refreshIntervalSlider.addEventListener("input", (event) => {
  let newUpdatesPerS = logSlider(
    minUpdatesPerS,
    maxUpdatesPerS,
    event.target.value
  );

  let newRefreshInterval = 1000 / newUpdatesPerS;
  game.setRefreshInterval(newRefreshInterval);
});

cellSizeSlider.addEventListener("input", (event) => {
  let newCellSize = logSlider(
    CONFIG.minCellSize,
    CONFIG.maxCellSize,
    event.target.value
  );

  game.setCellSize(newCellSize);
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

runStopButton.addEventListener("click", (event) => {
  if (runStopButton.textContent === "Run") {
    game.start();
    runStopButton.textContent = "Stop";
  } else {
    game.pause();
    runStopButton.textContent = "Run";
  }
});

stepButton.addEventListener("click", (event) => {
  game.updateAndRenderBoard();
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
