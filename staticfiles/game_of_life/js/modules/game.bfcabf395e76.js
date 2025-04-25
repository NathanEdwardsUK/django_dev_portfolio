import { Board } from "./board.js";

export class Game {
  constructor(canvas, initialAliveProbability, refreshInterval, initialState) {
    this.canvas = canvas;
    this.initialAliveProbability = initialAliveProbability;
    this.refreshInterval = refreshInterval;
    this.initialState = initialState;
    this.resizeTrigger = false;
    this.selectedPattern = null;
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
    if (!event.clientX) {
      return;
    }
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

    if (!this.selectedPattern) {
      this.board.toggleCellState(cell, isIndicative);
    } else {
      this.board.insertArray(this.selectedPattern, x, y, isIndicative);
    }

    // Ensure that an indicative pattern is not left overlaying the newly placed pattern
    if (!isIndicative) {
      this.board.clearIndicativeCells();
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
    this.canvas.renderBoard(this.board.getCells());
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

  pause() {
    this.state = "stopped"
  }

  start() {
    this.state = "running";
    this.nextTurn();
  }

  nextTurn() {
    if (this.state == "running") {
      setTimeout(() => {
        this.updateAndRenderBoard();
        this.nextTurn();
      }, this.refreshInterval);
    }
  }

  setRefreshInterval(newIntervalMs) {
    this.refreshInterval = newIntervalMs;
  }

  setCellSize(newCellSize) {
    this.canvas.setCellSize(newCellSize);
    this.canvas.renderBoard(this.board.getCells());
  }

  clearBoard() {
    this.board.clearCells();
    this.updateAndRenderBoard();
  }

  setSelectedPattern(pattern) {
    this.selectedPattern = pattern;
  }

  getSelectedPattern() {
    return this.selectedPattern;
  }

  rotateSelectedPattern() {
    if (!this.selectedPattern) return;

    const M = this.selectedPattern.length;
    const N = this.selectedPattern[0].length;

    let rotatedPattern = new Array(N);
    for (let i = 0; i < N; i++) {
      rotatedPattern[i] = new Array(M);
    }

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        rotatedPattern[i][j] = this.selectedPattern[M - j - 1][i];
      }
    }

    this.selectedPattern = rotatedPattern;
  }
}
