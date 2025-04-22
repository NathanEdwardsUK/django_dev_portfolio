import { Board } from "./board.js";
import { PATTERNS } from "./patterns.js";

export class Game {
  constructor(canvas, initialAliveProbability, refreshInterval, initialState) {
    this.canvas = canvas;
    this.initialAliveProbability = initialAliveProbability;
    this.refreshInterval = refreshInterval;
    this.initialState = initialState;
    this.resizeTrigger = false;
    this.selectedPattern = "none";
  }

  handleCanvasClick(event) {
    let [x, y] = this.canvas.windowToCellCoordinates(event.x, event.y);
    let cell = this.board.getCells()[y][x];
    if (this.selectedPattern == "none") {
      cell.toggleState();
    } else {
      this.board.insertArray(PATTERNS[this.selectedPattern], cellX, cellY);
    }

    this.canvas.renderBoard(this.board.getCells());
  }

  handleStartButtonClick() {
    if (this.loopIntervalID === undefined) {
      this.start();
    }
  }

  initNewGame() {
    let [boardHeight, boardwidth] = this.canvas.calculateBoardSize();
    this.board = new Board(
      boardHeight,
      boardwidth,
      this.initialState,
      this.initialAliveProbability
    );
  }

  run() {
    this.canvas.resize();
    this.initNewGame();
    this.updateAndRenderBoard();
    this.start();
  }

  triggerCanvasResize() {
    this.canvas.resize();
    let [boardHeight, boardwidth] = this.canvas.calculateBoardSize();
    this.board.resize(boardHeight, boardwidth);
    this.updateAndRenderBoard();
  }

  updateAndRenderBoard() {
    this.board.updateCells();
    let cells = this.board.getCells();
    this.canvas.renderBoard(cells);
  }

  updateRefreshInterval(newInterval) {
    this.intervalID = newInterval;
    clearInterval(this.loopIntervalID);
  }

  pause() {
    clearInterval(this.loopIntervalID);
    this.loopIntervalID = undefined;
  }

  start() {
    if (this.loopIntervalID === undefined) {
      this.updateAndRenderBoard();

      this.loopIntervalID = setInterval(() => {
        this.updateAndRenderBoard();
      }, this.refreshInterval);
    }
  }

  clearBoard() {
    this.board.clearCells();
    this.updateAndRenderBoard();
  }

  changeSelectedPattern(pattern) {
    this.selectedPattern = pattern;
  }
}
