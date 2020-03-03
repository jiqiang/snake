import React, { useState, useEffect } from "react";
import "./App.css";
import { CellType, Board, Cell, Direction, DirectionKeyCodeMap, OppsiteDirectionKeyCodeMap } from "./types";
import { useInterval } from './hooks';

const board = new Board(30, 30);

const App = () => {

  const [cells, setCells] = useState<Cell[][]>(board.GetCells());
  const [direction, setDirection] = useState<Direction | undefined>(undefined);
  const [delay, setDelay] = useState<number | undefined>(undefined);
  const [touchStart, setTouchStart] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    document.addEventListener('keydown', handleDirectionChange);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    return () => { 
      document.removeEventListener('keydown', handleDirectionChange); 
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd); 
    }
  });

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart([e.touches[0].clientX, e.touches[0].clientY]);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const horizontalDistance = e.changedTouches[0].clientX - touchStart[0];
    const verticalDistance = e.changedTouches[0].clientY - touchStart[1];

    if (Math.abs(horizontalDistance) <= Math.abs(verticalDistance)) {
      if (verticalDistance <= 0) {
        document.dispatchEvent(new KeyboardEvent('keydown', {'code': 'ArrowUp'}));
      } else {
        document.dispatchEvent(new KeyboardEvent('keydown', {'code': 'ArrowDown'}));
      }
    } else {
      if (horizontalDistance <= 0) {
        document.dispatchEvent(new KeyboardEvent('keydown', {'code': 'ArrowLeft'}));
      } else {
        document.dispatchEvent(new KeyboardEvent('keydown', {'code': 'ArrowRight'}));
      }
    }
  };

  const handleDirectionChange = (e: KeyboardEvent) => {
    if (board.IsGameOver()) {
      return;
    }

    if (delay === undefined) {
      setDelay(100);
    }

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
    console.log('tick');
    board.MoveSnake(direction);
    if (board.IsGameOver()) {
      setDelay(undefined);
    }
    setCells([...board.GetCells()]);
  }, delay);

  return (
    <>
      <h3>Scores: {board.GetScore()}</h3>
      <div className="board">
        {cells.map((row, rowIdx) => (
          <div className="row" key={`row-${rowIdx}`}>
            {row.map((cell, colIdx) => (
              <div className="col" key={`col-${colIdx}`}>
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
