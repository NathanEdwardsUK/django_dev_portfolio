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
    this.mouseOverCell = null;
  }

  handleCanvasClick(event) {
    let [x, y] = this.canvas.windowToCellCoordinates(
      event.layerX,
      event.layerY
    );
    this.insertBoardPatternAndRender(x, y, false);
  }

  handleMouseMove(event) {
    let [x, y] = this.canvas.windowToCellCoordinates(
      event.layerX,
      event.layerY
    );

    if (!this.mouseOverCell) {
      this.mouseOverCell = this.board.getCells()[y][x];
      this.insertBoardPatternAndRender(x, y, true);
      return;
    }

    let [prevX, prevY] = this.mouseOverCell.getCoordinates();
    if (x === prevX && y === prevY) {
      return;
    }

    this.board.clearIndicativeCells();
    this.mouseOverCell = this.board.getCells()[y][x];
    this.insertBoardPatternAndRender(x, y, true);
  }

  insertBoardPatternAndRender(x, y, isIndicative) {
    let cell = this.board.getCells()[y][x];
    if (!cell) {
      return;
    }

    if (this.selectedPattern == "none") {
      this.board.toggleCellState(cell, isIndicative);
    } else {
      let pattern = PATTERNS[this.selectedPattern];
      this.board.insertArray(pattern, x, y, isIndicative);
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
    this.canvas.renderBoard(this.board.getCells());
  }

  updateAndRenderBoard() {
    this.board.updateCells();
    this.canvas.renderBoard(this.board.getCells());
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
