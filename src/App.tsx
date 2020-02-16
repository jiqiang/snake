import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { CellType, Board, Cell, Direction } from "./types";
import { useInterval } from './hooks';

const board = new Board(30, 30);

function App() {

  const [cells, setCells] = useState<Cell[][]>([]);
  const [direction, setDirection] = useState<Direction>(Direction.STAY);
  const boardEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boardEl.current?.focus();
    setCells(board.GetCells());
  }, []);

  const handleDirectionChange = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.defaultPrevented) {
      return;
    }

    switch (e.key) {
      case "Down": // IE/Edge specific value
      case "ArrowDown":
        // Do something for "down arrow" key press.
        setDirection(prevDirection => {
          return prevDirection === Direction.UP ? Direction.UP : Direction.DOWN;
        });
        break;
      case "Up": // IE/Edge specific value
      case "ArrowUp":
        // Do something for "up arrow" key press.
        setDirection(prevDirection => {
          return prevDirection === Direction.DOWN ? Direction.DOWN : Direction.UP;
        });
        break;
      case "Left": // IE/Edge specific value
      case "ArrowLeft":
        // Do something for "left arrow" key press.
        setDirection(prevDirection => {
          return prevDirection === Direction.RIGHT ? Direction.RIGHT : Direction.LEFT;
        });
        break;
      case "Right": // IE/Edge specific value
      case "ArrowRight":
        // Do something for "right arrow" key press.
        setDirection(prevDirection => {
          return prevDirection === Direction.LEFT ? Direction.LEFT : Direction.RIGHT;
        });
        break;
      case "Enter":
        // Do something for "enter" or "return" key press.
        break;
      case "Esc": // IE/Edge specific value
      case "Escape":
        // Do something for "esc" key press.
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
      <div tabIndex={0} className="board" onKeyDown={handleDirectionChange} ref={boardEl}>
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
