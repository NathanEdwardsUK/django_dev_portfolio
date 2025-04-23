export class Canvas {
  constructor(body, header, canvas, cellSize, aliveColor, deadColor) {
    // body and header are the two html elements needed to calculate canvas' responsive size and position
    this.body = body;
    this.header = header;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.cellSize = cellSize;
    this.aliveColor = aliveColor;
    this.deadColor = deadColor;
  }

  resize() {
    let height = this.body.offsetHeight - this.header.offsetHeight;
    let width = this.body.offsetWidth;

    this.canvas.height = Math.round(height / this.cellSize + 1) * this.cellSize;
    this.canvas.width = Math.round(width / this.cellSize + 1) * this.cellSize;
    this.canvas.style.top = this.header.offsetHeight + "px";
  }

  windowToCellCoordinates(x, y) {
    return [Math.floor(x / this.cellSize), Math.floor(y / this.cellSize)];
  }

  renderBoard(cells) {
    for (let j = 0; j < cells.length; j++) {
      for (let i = 0; i < cells[j].length; i++) {
        this.renderCell(cells[j][i]);
      }
    }
  }

  renderCell(cell) {
    this.ctx.fillStyle =
      cell.getDisplayState() == 0 ? this.deadColor : this.aliveColor;
    let [xCoordinate, yCoordinate] = cell.getCoordinates();
    this.ctx.fillRect(
      xCoordinate * this.cellSize,
      yCoordinate * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }

  calculateBoardSize() {
    let boardHeight = this.canvas.height / this.cellSize;
    let boardwidth = this.canvas.width / this.cellSize;
    return [boardHeight, boardwidth];
  }

  getCellSize() {
    return this.cellSize;
  }
}
