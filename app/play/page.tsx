"use client"

import { useState, useEffect } from 'react';
import Square from '../components/Square';
import styles from '../styles/PlayGame.module.css';
import History from '../components/History';
import { SquareState, HistoryState } from '../types/types';
import boards from '../components/Boards';

export default function PlayGame() {
  const NUM_LIVES = 3;
  const symbols = ['+', '−', '×', '÷', '='];

  const [level, setLevel] = useState<number>(3);
  const [board, setBoard] = useState<SquareState[][]>(boards[level - 1]);
  const [expression, setExpression] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(NUM_LIVES);
  const [clicked, setClicked] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryState[]>([]);

  const initializeBoard = () => {
    setBoard(prev =>
      prev.map(row =>
        row.map(sq => ({
          color: '#ffffff',
          val: symbols.includes(sq.val) ? sq.val : Math.floor(Math.random() * 9 + 1).toString()
        }))
      )
    );
  }
  
  useEffect(() => {
    initializeBoard();
  }, [level]);
  
  const handleSquareClick = (row: number, col: number) => {
    // undo click
    if (board[row][col].color !== '#ffffff') {
      if (clicked[clicked.length - 1] === `${row},${col}`) {
        setBoard(prevGrid => {
          const newGrid = [...prevGrid];
          newGrid[row] = [...newGrid[row]];
          newGrid[row][col] = {
            ...newGrid[row][col],
            color: '#ffffff'
          };
          return newGrid;
        });

        setExpression(prev => {
          let nxt = [...prev];
          if (symbols.includes(nxt[nxt.length - 1])) {
            nxt.pop();
          } else {
            nxt[nxt.length - 1] = nxt[nxt.length - 1].slice(0, -1);
            if (nxt[nxt.length - 1].length === 0) {
              nxt.pop();
            }
          }
          return nxt;
        });
        
        setClicked(prev => {
          let nxt = [...prev];
          nxt.pop();
          return nxt;
        });
      }
      return;
    }

    // click adjacent
    if (clicked.length > 0) {
      const [prevRow, prevCol] = clicked[clicked.length - 1].split(',').map(Number);
      if (Math.abs(prevRow - row) > 1 || Math.abs(prevCol - col) > 1) {
        return;
      }
    }

    // single equals
    if (expression.includes('=') && board[row][col].val === '=') {
      return;
    }

    setBoard(prevGrid => {
      const newGrid = [...prevGrid];
      newGrid[row] = [...newGrid[row]];
      newGrid[row][col] = {
        ...newGrid[row][col],
        color: `#2fb55d`
      };
      return newGrid;
    });

    setExpression(prev => {
      let nxt = [...prev];
      const curr = board[row][col].val;
      if (nxt.length === 0 || symbols.includes(curr) || symbols.includes(nxt[nxt.length - 1])) {
        nxt.push(curr);
      } else {
        nxt[nxt.length - 1] = `${nxt[nxt.length - 1]}${board[row][col].val}`;
      }
      return nxt;
    });
    
    setClicked(prev => [...prev, `${row},${col}`]);
  };

  const clearBoard = (discard: boolean) => {
    setBoard(prev => {
      return prev.map((row, i) => {
        return row.map((sq, j) => ({
          color: '#ffffff',
          val: discard && !symbols.includes(sq.val) && clicked.includes(`${i},${j}`) ? Math.floor(Math.random() * 9 + 1).toString() : sq.val
        }));
      });
    });
    setExpression([]);
    setClicked([]);
  }

  const evaluate = (tokens: string[]) => {
    let result = parseInt(tokens[0]);
    for (let i = 1; i < tokens.length; i += 2) {
      const operator = tokens[i];
      const operand = parseInt(tokens[i + 1]);
      switch (operator) {
        case '+':
          result += operand;
          break;
        case '−':
          result -= operand;
          break;
        case '×':
          result *= operand;
          break;
        case '÷':
          result /= operand;
          break;
      }
    }
    return result;
  }

  const verify = (expr: string[]) => {
    console.log("history", history);
    const indexOfEquals = expr.indexOf('=');
    const left = evaluate(expr.slice(0, indexOfEquals))
    const right = evaluate(expr.slice(indexOfEquals + 1));
    if (left === right) {
      setScore(prev => prev + left + clicked.length);
      setConfirm('Correct :)');
      setHistory(prev => [...prev, {equation: expr.join(' '), correct: true}]);
    } else {
      setConfirm('Incorrect :(');
      setLives(prev => prev - 1);
      setHistory(prev => [...prev, {equation: expr.join(' '), correct: false}]);
    }
    clearBoard(true);
  }

  return (
    <main className={styles.container}>
      <div className={styles.column}>
        <h1 className={styles.title}>Play Game</h1>
        <p className={styles.description}>Score: {score}</p>
        <p className={styles.description}>Lives left: {lives}</p>
        <div className={styles.grid}>
          {board.map((row, rowIndex) => (
            row.map((square, colIndex) => (
              <Square
                key={`${rowIndex}-${colIndex}`}
                color={square.color}
                val={square.val}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              />
            ))
          ))}
        </div>
        <div>
          <button className={styles.button} onClick={() => clearBoard(false)}>Clear</button>
          <button
            className={styles.button} onClick={() => verify(expression)}
            disabled={!expression.includes('=')}
          >
            Evaluate
          </button>
        </div>
        <div className={styles.expression}>{expression.join(' ')}</div>
        <div className={styles.expression}>{confirm}</div>
      </div>
      <div className={styles.column}>
        <History history={history} />
      </div>
    </main>
  );
}
