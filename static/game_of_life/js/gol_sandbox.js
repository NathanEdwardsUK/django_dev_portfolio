import { Canvas } from "./modules/canvas.js";
import { Game } from "./modules/game.js";
import { Board } from "./modules/board.js";
import { PATTERNS, WELCOME_MSG_STATE_MIN_2 } from "./modules/patterns.js";

const CONFIG = {
  cellSize: 10,
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

let body = document.querySelector("body");
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

function resizeCanvas() {
  game.triggerCanvasResize(body.clientHeight, body.clientWidth);
}
window.addEventListener("resize", resizeCanvas);

// -------------------------------------------
// Handle Slider Interactions in Settings Box
// -------------------------------------------

settingsButton.addEventListener("click", toggleSettingsVisibility);

function logSlider(minValue, maxValue, newValue) {
  // Allows a slider to linearly control a non linear variable by
  // logarithmically rescaling
  newValue = Math.max(minValue, Math.min(maxValue, newValue));
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
function setSliderPositions() {
  refreshIntervalSlider.value = inverseLogSlider(
    minUpdatesPerS,
    maxUpdatesPerS,
    1000 / game.getRefreshInterval()
  );

  cellSizeSlider.value = inverseLogSlider(
    CONFIG.minCellSize,
    CONFIG.maxCellSize,
    mainCanvas.getCellSize()
  );
}

setSliderPositions();

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

// --------------------------------
// Handle Mouse Actions on Canvas
// --------------------------------

let mouseDown = false;
let mouseMoved = false;
let startX;
let startY;

htmlGameCanvas.addEventListener("pointerdown", (event) => {
  mouseDown = true;
  mouseMoved = false;
  startX = event.layerX;
  startY = event.layerY;
});

htmlGameCanvas.addEventListener("pointerup", (event) => {
  mouseDown = false;

  if (!mouseMoved) {
    game.handleCanvasClick(event.layerX, event.layerY);
  }
  startX = undefined;
  startY = undefined;
});

// In case the user mousedowns over the canvas and mouseups over another part of the window
window.addEventListener("pointerup", () => {
  mouseDown = false;
  startX = undefined;
  startY = undefined;
});

htmlGameCanvas.addEventListener("pointermove", (event) => {
  let cellSize = mainCanvas.getCellSize();

  if (
    mouseDown &&
    (Math.abs(event.layerX - startX) > cellSize / 2 ||
      Math.abs(event.layerY - startY) > cellSize / 2)
  ) {
    mouseMoved = true;
    game.clearBoardIndicativePatterns();
    game.recenterCanvas(-event.movementX, -event.movementY);
  } else {
    game.handleMouseMove(event);
  }
});

htmlGameCanvas.addEventListener("wheel", (event) => {
  event.preventDefault();

  let newCellSize = logSlider(
    CONFIG.minCellSize,
    CONFIG.maxCellSize,
    cellSizeSlider.value - event.deltaY * CONFIG.zoomSpeedFactor
  );
  game.setCellSize(newCellSize);

  setSliderPositions();
});

// --------------------
// Handle Touch Events
// --------------------

let startCellSizeSliderValue;
let startDist;
let touchEvents = [];

function copyTouch({ identifier, clientX, clientY }) {
  return { identifier, clientX, clientY };
}

htmlGameCanvas.addEventListener("touchstart", (event) => {
  // console.log(event);
  event.preventDefault();
  const touches = event.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    touchEvents.push(copyTouch(touches[i]));
  }

  if (touchEvents.length == 2) {
    startDist = euclideanDistance(touchEvents[0], touchEvents[1]);
    startCellSizeSliderValue = cellSizeSlider.value;
  } else if (touchEvents.length > 2) {
    startDist = undefined;
    startCellSizeSliderValue = undefined;
  }
});

function euclideanDistance(point1, point2) {
  return Math.sqrt(
    Math.pow(point2.clientY - point1.clientY, 2) +
    Math.pow(point2.clientX - point1.clientX, 2)
  );
}

htmlGameCanvas.addEventListener("touchmove", (event) => {
  event.preventDefault();
  // console.log("touchmove:");

  if (event.touches.length == 2 && startDist) {
    const curDist = euclideanDistance(event.touches[0], event.touches[1]);
    let changeDist = startDist - curDist;
    let screenSize = Math.sqrt(
      (htmlGameCanvas.offsetHeight, 2) + Math.pow(htmlGameCanvas.offsetWidth, 2)
    );

    let cellSizeSliderChange = CONFIG.zoomSpeedFactor * (100 * changeDist) / screenSize;
    let newCellSize = logSlider(
      CONFIG.minCellSize,
      CONFIG.maxCellSize,
      startCellSizeSliderValue - cellSizeSliderChange
    );

    game.setCellSize(newCellSize);
    setSliderPositions();
  } else {
    touchEvents = [];
  }
});

htmlGameCanvas.addEventListener("touchend", (event) => {
  game.clearBoardIndicativePatterns();

  event.preventDefault();
  touchEvents = [];
  startDist = undefined;
  startCellSizeSliderValue = undefined;
});

// --------------------
// Handle Button Clicks
// --------------------

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
    htmlPreviewCanvas,
    cellSize,
    "black",
    "white"
  );
  let previewBoard = new Board(pattern, 0);
  let cells = previewBoard.getCells();
  canvas.renderBoard(cells);
}

game.initNewGame();
resizeCanvas()
game.pause();
