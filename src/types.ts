export enum CellType {
  EMPTY,
  FOOD,
  SNAKE,
  WALL
};

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT
};

export const DirectionKeyCodeMap: { [keyCode: string]: Direction } = {
  'ArrowLeft': Direction.LEFT,
  'ArrowUp': Direction.UP,
  'ArrowRight': Direction.RIGHT,
  'ArrowDown': Direction.DOWN,
  // for IE
  'Left': Direction.LEFT,
  'Up': Direction.UP,
  'Right': Direction.RIGHT,
  'Down': Direction.DOWN
};

export const OppsiteDirectionKeyCodeMap: { [keyCode: string]: Direction } = {
  'ArrowLeft': Direction.RIGHT,
  'ArrowUp': Direction.DOWN,
  'ArrowRight': Direction.LEFT,
  'ArrowDown': Direction.UP,
  // for IE
  'Left': Direction.RIGHT,
  'Up': Direction.DOWN,
  'Right': Direction.LEFT,
  'Down': Direction.UP
};

export class Cell {
  private row: number;
  private col: number;
  private cellType: CellType;

  constructor(row: number, col: number, cellType?: CellType) {
    this.row = row;
    this.col = col;
    this.cellType = cellType || CellType.EMPTY;
  }

  public GetCellType(): CellType {
    return this.cellType;
  }

  public SetCellType(cellType: CellType): void {
    this.cellType = cellType;
  }

  public GetRow(): number {
    return this.row;
  }

  public GetCol(): number {
    return this.col;
  }
}

export class Board {
  private rowCount: number;
  private colCount: number;
  private cells: Cell[][];
  private snakeCells: Cell[];
  private isGameOver: boolean;
  private foodCell: Cell;


  constructor(rowCount: number, colCount: number) {
    this.rowCount = rowCount;
    this.colCount = colCount;
    this.cells = [];
    this.snakeCells = [new Cell(2, 2)];
    this.isGameOver = false;
    this.foodCell = new Cell(1, 1);

    this.Initialize();
    this.SetSnakeCells();
    this.GenerateFoodCell();
  }

  public Initialize(): void {
    for (let row = 0; row < this.rowCount; row++) {
      this.cells[row] = [];
      for (let col = 0; col < this.colCount; col++) {
        const isWallCell = [0, this.rowCount - 1].includes(row) || [0, this.rowCount - 1].includes(col);
        this.cells[row][col] = new Cell(row, col, isWallCell ? CellType.WALL : CellType.EMPTY);
      }
    }
  }

  public SetSnakeCells(): void {
    this.snakeCells.forEach((cell) => {
      this.cells[cell.GetRow()][cell.GetCol()].SetCellType(CellType.SNAKE);
    });
  }

  public GetCells(): Cell[][] {
    return this.cells;
  }

  public IsGameOver(): boolean {
    return this.isGameOver;
  }

  public GenerateFoodCell(): void {
    let row = Math.floor(Math.random() * (this.rowCount - 1));
    let col = Math.floor(Math.random() * (this.colCount - 1));
    while ([CellType.WALL, CellType.SNAKE].includes(this.cells[row][col].GetCellType())) {
      row = Math.floor(Math.random() * (this.rowCount - 1));
      col = Math.floor(Math.random() * (this.colCount - 1));
    }
    this.foodCell = new Cell(row, col, CellType.FOOD);
    this.cells[row][col].SetCellType(CellType.FOOD);
  }

  public MoveSnake(direction: Direction | undefined) {
    if (direction === undefined) {
      return;
    }

    let snakeHead = this.snakeCells[this.snakeCells.length - 1];
    let nextSnakeHeadCellRow: number;
    let nextSnakeHeadCellCol: number;

    switch (direction) {
      case Direction.RIGHT:
        nextSnakeHeadCellRow = snakeHead.GetRow() + 1;
        nextSnakeHeadCellCol = snakeHead.GetCol();
        break;
      case Direction.DOWN:
        nextSnakeHeadCellRow = snakeHead.GetRow();
        nextSnakeHeadCellCol = snakeHead.GetCol() + 1;
        break;
      case Direction.LEFT:
        nextSnakeHeadCellRow = snakeHead.GetRow() - 1;
        nextSnakeHeadCellCol = snakeHead.GetCol();
        break;
      case Direction.UP:
        nextSnakeHeadCellRow = snakeHead.GetRow();
        nextSnakeHeadCellCol = snakeHead.GetCol() - 1;
        break;
      default:
        nextSnakeHeadCellRow = snakeHead.GetRow();
        nextSnakeHeadCellCol = snakeHead.GetCol();
    }

    const nextCellType = this.cells[nextSnakeHeadCellRow][nextSnakeHeadCellCol].GetCellType()
    if ([CellType.WALL, CellType.SNAKE].includes(nextCellType)) {
      this.isGameOver = true;
      return;
    }

    if (this.cells[nextSnakeHeadCellRow][nextSnakeHeadCellCol].GetCellType() !== CellType.FOOD) {
      this.cells[nextSnakeHeadCellRow][nextSnakeHeadCellCol].SetCellType(CellType.SNAKE);
      this.snakeCells.push(new Cell(nextSnakeHeadCellRow, nextSnakeHeadCellCol));
      
      const snakeTailCell = this.snakeCells.shift();
      if (snakeTailCell) {
        this.cells[snakeTailCell.GetRow()][snakeTailCell.GetCol()].SetCellType(CellType.EMPTY);
      }
    } else {
      this.cells[nextSnakeHeadCellRow][nextSnakeHeadCellCol].SetCellType(CellType.SNAKE);
      this.snakeCells.push(new Cell(nextSnakeHeadCellRow, nextSnakeHeadCellCol));
      this.GenerateFoodCell();
    }
  }
}
