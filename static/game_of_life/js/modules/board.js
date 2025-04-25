import { Cell } from "./cell.js";

export class Board {
  constructor(
    // boardHeight,
    // boardWidth,
    initialStateArray = [[]], // Int array defining starting condition of board
    aliveProbability = 0.1
  ) {
    /*
      - boardHeight/Width defines number of cells in the board.
      - initialStateArray is an array that contains the starting state of the board. 
        It does not have to be the same size as defined by board height, the extra 
        cells will be generated around it or removed from it if necessary.
      - aliveProbability is the probability that any cells created to fill in 
        gaps in the initialStateArray are alive
    */
    // this.boardHeight = boardHeight;
    // this.boardWidth = boardWidth;
    this.initialStateArray = initialStateArray;
    this.aliveProbability = aliveProbability;
    this.cells = new Map(); // All cells that are either alive or neighbour to a live cells
    this.fillBoard();
    this.indicativeCells = [];
  }

  fillBoard() {
    let arrayHeight = this.initialStateArray.length;
    let arrayWidth = this.initialStateArray[0].length;

    for (let j = 0; j < arrayHeight; j++) {
      for (let i = 0; i < arrayWidth; i++) {
        let cellState = this.initialStateArray[j][i];
        cellState = cellState == -1 ? Number(Math.random() < this.aliveProbability) : cellState;

        if (cellState != 0) {
          let x = 1 + i - Math.round(arrayWidth / 2);
          let y = 1 + j - Math.round(arrayHeight / 2);
          let coordStr = this.coordinatesToString(x, y);
          let cell = new Cell([x, y], cellState);
          this.cells.set(coordStr, cell);
        }
      }
    }
  }

  // resizeArray(array, newHeight, newWidth) {
  //   array = structuredClone(array);
  //   // First resize array by adding or removing columns and rows. Do this
  //   // symmetrically such that the start array renders in the middle of the board.
  //   let rowDiff = newHeight - array.length;
  //   let colDiff = newWidth - (array[0] ?? []).length;

  //   // Number of columns and rows to add to the front and back of the
  //   // initial array so that it matches our desired size.
  //   let frontColDiff = Math.round(colDiff / 2);
  //   let backColDiff = colDiff - frontColDiff;

  //   let frontRowDiff = Math.round(rowDiff / 2);
  //   let backRowDiff = rowDiff - frontRowDiff;

  //   // Adjust number of columns
  //   if (colDiff > 0) {
  //     for (let j = 0; j < array.length; j++) {
  //       array[j] = new Array(frontColDiff)
  //         .fill(-1) //
  //         .concat(array[j])
  //         .concat(new Array(backColDiff).fill(-1));
  //     }
  //   } else if (colDiff < 0) {
  //     for (let j = 0; j < array.length; j++) {
  //       array[j] = array[j].slice(-frontColDiff, array[j].length + backColDiff);
  //     }
  //   }

  //   // Adjust number of rows
  //   if (rowDiff > 0) {
  //     for (let j = 0; j < frontRowDiff; j++) {
  //       array = [new Array(newWidth).fill(-1)].concat(array);
  //     }
  //     for (let j = 0; j < backRowDiff; j++) {
  //       array = array.concat([new Array(newWidth).fill(-1)]);
  //     }
  //   } else if (rowDiff < 0) {
  //     array = array.slice(-frontRowDiff, array.length + backRowDiff);
  //   }

  //   return array;
  // }

  // resize(newHeight, newWidth) {
  //   let intArray = new Array(newHeight);

  //   for (let j = 0; j < newHeight; j++) {
  //     intArray[j] = new Array(newWidth);

  //     for (let i = 0; i < newWidth; i++) {
  //       if (j < this.boardHeight && i < this.boardWidth) {
  //         intArray[j][i] = this.cellsOld[j][i].getState();
  //       } else {
  //         intArray[j][i] = -1;
  //       }
  //     }
  //   }

  //   this.cellsOld = this.intArrayToCells(intArray, this.aliveProbability);
  //   this.boardHeight = newHeight;
  //   this.boardWidth = newWidth;
  // }

  toggleCellState(cell, isIndicative) {
    cell.toggleState(isIndicative);
    if (isIndicative) {
      this.indicativeCells.push(cell);
    }
  }

  insertPattern(insertArray, x, y, isIndicative) {
    // Inserts int array into board setting boardCells[x, y] = insertArray[0,0]
    let insertHeight = insertArray.length;
    let insertWidth = insertArray[0].length;

    for (let j = 0; j < insertHeight; j++) {
      for (let i = 0; i < insertWidth; i++) {
        let coords = [x + i, y + j];
        let coordStr = this.coordinatesToString(coords[0], [coords[1]]);
        let cellState = insertArray[j][i];

        if (!this.cells.get(coordStr)) {
          this.cells.set(coordStr, new Cell(coords, 0));
        }

        let cell = this.cells.get(coordStr);

        if (!isIndicative) {
          cell.setState(cellState);
        } else {
          cell.setIndicativeState(cellState);
          this.indicativeCells.push(cell);
        }
      }
    }
  }

  clearIndicativeCells() {
    for (let i = 0; i < this.indicativeCells.length; i++) {
      this.indicativeCells[i].setIndicativeState(null);
    }

    this.indicativeCells = [];
  }

  // intArrayToCells(intArray, aliveProbability) {
  //   // Converts an int array into an array of cells
  //   let height = intArray.length;
  //   let width = intArray[0].length;
  //   let cells = new Array(height);

  //   for (let j = 0; j < height; j++) {
  //     cells[j] = new Array(width);

  //     for (let i = 0; i < width; i++) {
  //       let cellState = intArray[j][i];
  //       if (cellState == -1) {
  //         cellState = Number(Math.random() < aliveProbability);
  //       }
  //       cells[j][i] = new Cell([i, j], cellState);
  //     }
  //   }

  //   return cells;
  // }

  updateCells() {
    let prevCells = structuredClone(this.cells);

    // First go through all cells, add them and their neighbours to this.cells, count number of live neighbours
    for (let [coordStr, obj] of prevCells.entries()) {
      let cell = this.cells.get(coordStr);
      if (cell.getState() == 1) {
        let [x, y] = this.stringToCoordinates(coordStr);
        this.addNeighboursToCells(x, y);
      }
    }

    // Then calculate and update every cell state
    for (let [coordStr, cell] of this.cells.entries()) {
      cell.calculateNextState();
      cell.updateState();
    }

    // Then delete all the dead cells and reset live neighbour counts to 0
    for (let [coordStr, cell] of this.cells.entries()) {
      if (cell.getState() == 0) {
        this.cells.delete(coordStr)
      } else {
        cell.setLiveNeighboursCount(0);
      }
    }
  }

  clearCells() {
    this.cells = new Map();
  }

  addNeighboursToCells(x, y) {
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (i == x && j == y) continue;

        let coordStr = this.coordinatesToString(i, j);
        let cell = this.cells.get(coordStr)

        if (cell) {
          cell.setLiveNeighboursCount(cell.getLiveNeighboursCount() + 1);
        } else {
          cell = new Cell([i, j], 0, 1)
          this.cells.set(coordStr, cell);
        }
      }
    }
  }

  getCells() {
    return this.cells;
  }

  coordinatesToString(x, y) {
    return `${x},${y}`;
  }

  stringToCoordinates(str) {
    let x = Number(str.split(",")[0]);
    let y = Number(str.split(",")[1]);
    return [x, y];
  }
}
