export class Canvas {
  constructor(body, header, canvas, cellSize, aliveColor, deadColor) {
    // body and header are the two html elements needed to calculate canvas' responsive size and position
    this.body = body;
    this.header = header;
    this.canvas = canvas;
    this.cellSize = cellSize;
    this.aliveColor = aliveColor;
    this.deadColor = deadColor;
    this.canvas.style.background = deadColor;
    this.centerCoordinates = [0, 0];
  }

  resize() {
    let height = this.body.offsetHeight - this.header.offsetHeight;
    let width = this.body.offsetWidth;

    this.canvas.height = Math.round(height / this.cellSize) * this.cellSize;
    this.canvas.width = Math.round(width / this.cellSize) * this.cellSize;
    this.canvas.style.top = this.header.offsetHeight + "px";
  }

  renderBoard(cells) {
    // Render the whole board with the dead colour then render the alive and immortal cells
    let ctx = this.canvas.getContext("2d");
    ctx.fillStyle = this.deadColor;
    ctx.fillRect(0, 0, 999999, 999999);
    ctx.fillStyle = this.aliveColor;

    for (let [coordStr, cell] of cells.entries()) {
      if (cell.getDisplayState() > 0) {
        let [x, y] = cell.getCoordinates();
        let [canvasX, canvasY] = this.boardToCanvasCoordinates(x, y);
        ctx.fillRect(canvasX, canvasY, this.cellSize, this.cellSize);
      }
    }
  }

  boardToCanvasCoordinates(x, y) {
    let shiftedX = x - this.centerCoordinates[0] - 0.5;
    let shiftedY = y - this.centerCoordinates[1] - 0.5;
    let canvasX = this.canvas.width / 2 + shiftedX * this.cellSize;
    let canvasY = this.canvas.height / 2 + shiftedY * this.cellSize;
    return [canvasX, canvasY];
  }

  canvasToBoardCoordinates(x, y) {
    let boardX = Math.round(
      (x - this.canvas.width / 2) / this.cellSize + this.centerCoordinates[0]
    );
    let boardY = Math.round(
      (y - this.canvas.height / 2) / this.cellSize + this.centerCoordinates[1]
    );
    return [boardX, boardY];
  }

  getCellSize() {
    return this.cellSize;
  }

  setCellSize(cellSize) {
    this.cellSize = cellSize;
  }

  setCenterCoordinates(x, y) {
    this.centerCoordinates[0] += x / this.cellSize;
    this.centerCoordinates[1] += y / this.cellSize;
  }
}
