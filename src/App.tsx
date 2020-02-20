import React, { useState, useEffect } from "react";
import "./App.css";
import { CellType, Board, Cell, Direction, DirectionKeyCodeMap, OppsiteDirectionKeyCodeMap } from "./types";
import { useInterval } from './hooks';

const board = new Board(30, 30);

function App() {

  const [cells, setCells] = useState<Cell[][]>(board.GetCells());
  const [direction, setDirection] = useState<Direction>(Direction.STAY);

  useEffect(() => {
    document.addEventListener('keydown', handleDirectionChange);
    return () => { document.removeEventListener('keydown', handleDirectionChange); }
  });

  const handleDirectionChange = (e: KeyboardEvent) => {
    if (e.defaultPrevented) {
      return;
    }

    // Do nothing if it is same to previous direction
    if (DirectionKeyCodeMap[e.code] === direction) {
      return;
    }

    // Do nothin if previous direction is oppsite direction of current one
    if (OppsiteDirectionKeyCodeMap[e.code] === direction) {
      return;
    }

    switch (e.code) {
      case "Down": // IE/Edge specific value
      case "ArrowDown":
        // Do something for "down arrow" key press.
        setDirection(Direction.DOWN);
        break;
      case "Up": // IE/Edge specific value
      case "ArrowUp":
        // Do something for "up arrow" key press.
        setDirection(Direction.UP);
        break;
      case "Left": // IE/Edge specific value
      case "ArrowLeft":
        // Do something for "left arrow" key press.
        setDirection(Direction.LEFT);
        break;
      case "Right": // IE/Edge specific value
      case "ArrowRight":
        // Do something for "right arrow" key press.
        setDirection(Direction.RIGHT);
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }

    // Cancel the default action to avoid it being handled twice
    e.preventDefault();
  };

  useInterval(() => {
    board.MoveSnake(direction);
    if (board.IsGameOver()) {
      return;
    }
    setCells([...board.GetCells()]);
  }, 100);

  return (
    <>
      <div tabIndex={0} className="board">
        {cells.map((row, rowIdx) => (
          <div className="row" key={rowIdx}>
            {row.map((cell, colIdx) => (
              <div className="col" key={colIdx}>
                <div
                  className={`cell ${cell.GetCellType() === CellType.FOOD && "is-food"} ${cell.GetCellType() === CellType.SNAKE && "is-snake"} ${cell.GetCellType() === CellType.WALL && "is-wall"}`}
                ></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
