export enum CellType {
  EMPTY,
  FOOD,
  SNAKE,
  WALL
}

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
    this.Initialize();
    this.SetSnakeCells();
    this.SetFoodCell();
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
  }

  public SetFoodCell(): void {
    this.cells[this.foodCell.GetRow()][this.foodCell.GetCol()].SetCellType(CellType.FOOD);
  }

  public MoveSnake(direction: Direction) {
    if (direction === Direction.STAY) {
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
      this.snakeCells.push(new Cell(nextSnakeHeadCellRow, nextSnakeHeadCellCol));
      this.snakeCells.shift();
    } else {
      this.snakeCells.push(new Cell(nextSnakeHeadCellRow, nextSnakeHeadCellCol));
      this.GenerateFoodCell();
    }
  }
}

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  STAY
}

export class Game {
  private board: Board;
  private direction: Direction | undefined;

  constructor(board: Board) {
    this.board = board;
  }

  public GetBoard(): Board {
    return this.board;
  }

  public SetDirection(direction: Direction): void {
    this.direction = direction;
  }

  public GetDirection(): Direction | undefined {
    return this.direction;
  }
}
