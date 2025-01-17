"use client";

import styles from '../styles/Tutorial.module.css';
import { useState, useEffect, useRef } from 'react';
import Square from '../components/Square';
import { SquareState } from '../types/types';
import { boards, levelSizes } from '../constants/boardStates';
import { Button, Input } from '@aws-amplify/ui-react';

export default function Tutorial() {
  const NUM_LIVES = 3;
  const symbols = ['+', '−', '×', '÷', '='];
  const TIME_LIMIT = 30;

  const [level, setLevel] = useState<number>(1);
  const [board, setBoard] = useState<SquareState[][]>(boards[level - 1]);
  const [expression, setExpression] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(NUM_LIVES);
  const [clicked, setClicked] = useState<string[]>([]);
  const [highlight, setHighlight] = useState<number>(4);
  const [timeLeft, setTimeLeft] = useState<number>(TIME_LIMIT);
  const timerRef = useRef<null | ReturnType<typeof setInterval>>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('not found');
  const [saved, setSaved] = useState<string>('Click save to change your username');

  const initializeBoard = () => {
    setBoard(prev =>
      prev.map(row =>
        row.map(sq => ({
          color: '#ffffff',
          val: symbols.includes(sq.val) ? sq.val : Math.floor(Math.random() * 9 + 1).toString()
        }))
      )
    );
    setHighlight(-1);
    setExpression([]);
    setClicked([]);
  }
  
  useEffect(() => {
    initializeBoard();
  }, []);
  
  const handleSquareClick = (row: number, col: number) => {
    if (gameOver) return;
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
      const oldHighlight = (highlight + 4) % 5;
      setHighlight(oldHighlight);
      return;
    }

    // must click adjacent
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

    const newHighlight = (highlight + 1) % 5;
    setBoard(prevGrid => {
      const G = Math.round(196 - newHighlight * 28).toString(16).padStart(2, '0');
      const B = Math.round(255 - newHighlight * 24).toString(16).padStart(2, '0');
      const newGrid = prevGrid.map((r, i) => 
        i === row ? r.map((cell, j) => 
          j === col ? { ...cell, color: `#00${G}${B}` } : cell
        ) : r
      );
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
    setHighlight(newHighlight);
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
    setHighlight(-1);
  }

  const evaluate = (tokens: string[]) => {
    const stack = [];
    let sign = '+';
    let val = 0;
    let prev = 1;

    for (let i = 0; i < tokens.length; i++) {
      if (!symbols.includes(tokens[i])) {
        val = parseInt(tokens[i]);
      }

      if (symbols.includes(tokens[i]) || i === tokens.length - 1) {
        switch (sign) {
          case '+':
            stack.push(val);
            break;
          case '−':
            stack.push(-1 * val);
            break;
          case '×':
            prev = stack.pop() ?? 1;
            stack.push(prev * val);
            break;
          case '÷':
            prev = stack.pop() ?? 1;
            stack.push(prev / val);
            break;
        }
        sign = tokens[i];
        val = 0;
      }
    }
    return stack.reduce((acc, curr) => acc + curr, 0);
  }

  const verify = (expr: string[]) => {
    const indexOfEquals = expr.indexOf('=');
    const left = evaluate(expr.slice(0, indexOfEquals))
    const right = evaluate(expr.slice(indexOfEquals + 1));
    let newScore = score;
    if (left === right) {
      newScore += left + clicked.length;
      setScore(newScore);
      setConfirm('Correct :)');
      
    } else {
      const penalty = Math.pow(10, ((levelSizes.get(level) ?? 3) - 3) / 2);
      newScore -= penalty;
      setScore(newScore);
      setConfirm('Incorrect :(');
      setLives((prev) => Math.max(prev - 1, 0));
    }
    clearBoard(true);
    levelUp(newScore);
  }

  const scoreMap = new Map<number, number>([
    [1, 50],
    [2, 100],
    [3, 500],
    [4, 1000],
    [5, 50000],
    [6, 100000]
  ]);
  
  const levelUp = (newScore: number) => {
    const threshold = scoreMap.get(level);
    if (threshold !== undefined && newScore >= threshold) {
      setLevel((prev) => Math.min(prev + 1, 6));
      setBoard(boards[level]);
      initializeBoard();
    }
  }
  const checkDisabled = (expr: string[]) => {
    const indexOfEquals = expr.indexOf('=');
    if (indexOfEquals === -1) return true;
    const left = expr.slice(0, indexOfEquals);
    const right = expr.slice(indexOfEquals + 1);
    if (left.length === 0 || right.length === 0) return true;
    if (symbols.includes(right[right.length - 1])) return true;
  }

  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.pageTitle}>Tutorial</h1>
      <p className={styles.sectionText}>
        PαthMαth is a dynamic mental math maze searching game designed to help students improve arithmetic fluency.
      </p>
      <p className={styles.sectionText}>
        Follow the steps below to start playing!
      </p>
      <div>
        <div className={styles.card}>
          <div className={styles.topBar}>
            <span className={styles.topText}>Lives: {'❤️'.repeat(lives)}</span>
            <span className={styles.topText}>Score: {score} / {scoreMap.get(level)}</span>
            <span className={styles.topText}>Level: {level}</span>
          </div>
          <div className={styles.expression}>
            {expression.length > 0 ? expression.join(' ') : "Click on the squares to start typing an expression!"}
          </div>
          <div className={styles.timerBar}>
            <div 
              className={styles.timerFill}
              style={{
                width: `${(timeLeft / TIME_LIMIT) * 100}%`,
                backgroundColor: timeLeft > 5 ? 'limegreen' : timeLeft > 2 ? 'orange' : 'red',
                transition: timeLeft !== TIME_LIMIT ? 'width 0.1s linear' : 'none',
                borderRadius: '5px',
                height: '100%'
              }}
            />
          </div>
          <div
            className={styles.board}
            style={{
              gridTemplateColumns: `repeat(${levelSizes.get(level)}, 60px)`,
            }}
          >
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
          <div className={styles.buttonGroup}>
            <Button onClick={() => clearBoard(false)}>Clear</Button>
            <Button
              onClick={() => verify(expression)}
              disabled={checkDisabled(expression)}
            >
              Evaluate
            </Button>
          </div>
          <div className={styles.expression}
            style={{
              color: confirm.length === 0 ? 'black' : confirm === 'Correct :)' ? 'limegreen' : 'red'
            }}
          >
            {confirm.length > 0 ? confirm : 'Click "Evaluate" to submit your equation!'}
          </div>
        </div>
      </div>
    </main>
  );
}

