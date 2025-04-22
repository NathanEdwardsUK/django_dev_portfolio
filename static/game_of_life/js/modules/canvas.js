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

    this.canvas.height = Math.round(height / this.cellSize) * this.cellSize;
    this.canvas.width = Math.round(width / this.cellSize) * this.cellSize;
    this.canvas.style.top = this.header.offsetHeight + "px";
    // this.canvas.
    // this.canvas.height =
    // this.canvas.height = Math.round(this.body.offsetHeight / this.cellSize) * this.cellSize;
    // this.canvas.width =
    //   Math.round(this.body.offsetWidth / this.cellSize) * this.cellSize;
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
      cell.getState() == 0 ? this.deadColor : this.aliveColor;
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
