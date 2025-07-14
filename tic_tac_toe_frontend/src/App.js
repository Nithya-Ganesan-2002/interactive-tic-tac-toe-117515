import React, { useState, useEffect } from "react";
import "./App.css";

// Utility functions
const getInitialBoard = () => Array(3).fill(null).map(() => Array(3).fill(null));
const getNextPlayer = (current) => (current === "X" ? "O" : "X");

// PUBLIC_INTERFACE
function App() {
  // Game state
  const [board, setBoard] = useState(getInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null); // 'X', 'O', 'draw', or null
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });
  const [gameActive, setGameActive] = useState(true);

  useEffect(() => {
    const status = checkWinner(board);
    if (status === "X" || status === "O") {
      setWinner(status);
      setScore((s) => ({ ...s, [status]: s[status] + 1 }));
      setGameActive(false);
    } else if (status === "draw") {
      setWinner("draw");
      setScore((s) => ({ ...s, draws: s.draws + 1 }));
      setGameActive(false);
    }
  }, [board]);

  // PUBLIC_INTERFACE
  function handleClick(row, col) {
    if (board[row][col] || winner) return;
    const updatedBoard = board.map((r, i) =>
      r.map((cell, j) =>
        i === row && j === col ? currentPlayer : cell
      )
    );
    setBoard(updatedBoard);
    setCurrentPlayer(getNextPlayer(currentPlayer));
  }

  // PUBLIC_INTERFACE
  function restartGame() {
    setBoard(getInitialBoard());
    setCurrentPlayer((winner === "draw" || winner === "O") ? "X" : "O");
    setWinner(null);
    setGameActive(true);
  }

  // PUBLIC_INTERFACE
  function checkWinner(bd) {
    // Rows, columns and diagonals
    const lines = [
      // Rows
      [bd[0][0], bd[0][1], bd[0][2]],
      [bd[1][0], bd[1][1], bd[1][2]],
      [bd[2][0], bd[2][1], bd[2][2]],
      // Columns
      [bd[0][0], bd[1][0], bd[2][0]],
      [bd[0][1], bd[1][1], bd[2][1]],
      [bd[0][2], bd[1][2], bd[2][2]],
      // Diagonals
      [bd[0][0], bd[1][1], bd[2][2]],
      [bd[0][2], bd[1][1], bd[2][0]],
    ];
    for (const line of lines) {
      if (line[0] && line[0] === line[1] && line[1] === line[2]) return line[0];
    }
    // Draw
    if (bd.flat().every((cell) => cell !== null)) return "draw";
    return null;
  }

  // PUBLIC_INTERFACE
  function getStatusText() {
    if (winner === "draw") return "It’s a Draw!";
    if (winner === "X") return "Player X Wins!";
    if (winner === "O") return "Player O Wins!";
    return `Current Turn: Player ${currentPlayer}`;
  }

  return (
    <div className="ttt-app-bg">
      <main className="ttt-center-panel">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <Scoreboard score={score} />
        <StatusBar
          status={getStatusText()}
          primary={winner === "X"}
          accent={!!winner && winner !== "X" && winner !== "draw"}
        />
        <Board board={board} onCellClick={handleClick} disabled={!gameActive} />
        <button className="ttt-btn" onClick={restartGame} aria-label="Restart Game">
          {winner ? "New Game" : "Restart"}
        </button>
        <footer className="ttt-footer">A modern, minimal tic tac toe app.</footer>
      </main>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Scoreboard component displaying player X, O, and draw counts.
 */
function Scoreboard({ score }) {
  return (
    <div className="ttt-scoreboard">
      <span className="score-px">X: {score.X}</span>
      <span className="score-draw">Draws: {score.draws}</span>
      <span className="score-po">O: {score.O}</span>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Shows the current status message (player turn, win, draw)
 */
function StatusBar({ status, primary, accent }) {
  // primary/accent booleans color the status text
  let colorClass = "";
  if (primary) colorClass = "ttt-status-primary";
  if (accent) colorClass = "ttt-status-accent";
  if (status === "It’s a Draw!") colorClass = "ttt-status-draw";
  return (
    <div className={`ttt-status-bar ${colorClass}`}>
      {status}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Game board (3x3) component.
 */
function Board({ board, onCellClick, disabled }) {
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
      {board.map((row, i) => (
        <div className="ttt-board-row" key={i} role="row">
          {row.map((cell, j) => (
            <Cell
              key={j}
              value={cell}
              onClick={() => onCellClick(i, j)}
              disabled={disabled || !!cell}
              aria-posinset={i * 3 + j + 1}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * A single Tic Tac Toe cell/square.
 */
function Cell({ value, onClick, disabled }) {
  return (
    <button
      className="ttt-cell"
      onClick={onClick}
      disabled={disabled}
      aria-label={
        value
          ? value === "X"
            ? "Player X move"
            : "Player O move"
          : "Empty cell"
      }
    >
      {value || ""}
    </button>
  );
}

export default App;
