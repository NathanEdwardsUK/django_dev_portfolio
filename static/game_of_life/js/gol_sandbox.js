import { Canvas } from "./modules/canvas.js";
import { Game } from "./modules/game.js";
import { CONFIG } from "./modules/config.js";
import { PATTERNS } from "./modules/patterns.js";

let htmlBody = document.querySelector("body");
let htmlHeader = document.querySelector("header");
let htmlCanvas = document.getElementById("game-canvas");
let rotateButton = document.getElementById("rotate-button");
let runButton = document.getElementById("run-button");
let stopButton = document.getElementById("stop-button");
let clearButton = document.getElementById("clear-button");

let patternDropdown = document.getElementById("pattern-dropdown");
for (const pattern in PATTERNS) {
  patternDropdown.options.add(new Option(pattern, pattern));
}

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

htmlCanvas.addEventListener("click", (event) => {
  game.handleCanvasClick(event);
});

htmlCanvas.addEventListener("mousemove", (event) => {
  game.handleMouseMove(event);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "r") {
    game.rotateSelectedPattern();
  }
});

rotateButton.addEventListener("click", (event) => {
  game.rotateSelectedPattern();
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
  game.changeSelectedPattern(patternDropdown.value);
});

game.run();
