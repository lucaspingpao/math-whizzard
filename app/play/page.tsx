"use client";

import { useState, useEffect } from 'react';
import Square from '../components/Square';
import styles from '../styles/PlayGame.module.css';
import History from '../components/History';
import { SquareState, HistoryState } from '../types/types';
import boards from '../components/Boards';
import { Button } from '@aws-amplify/ui-react';
import PathMathLogo from "../../public/PathMath-logo.png";

export default function PlayGame() {
  const NUM_LIVES = 3;
  const symbols = ['+', '−', '×', '÷', '='];
  const TIME_LIMIT = 15;

  const [level, setLevel] = useState<number>(2);
  const [board, setBoard] = useState<SquareState[][]>(boards[level - 1]);
  const [expression, setExpression] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(NUM_LIVES);
  const [clicked, setClicked] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [highlight, setHighlight] = useState<number>(4);
  const [timeLeft, setTimeLeft] = useState<number>(TIME_LIMIT);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          setLives(prev => prev - 1);
          clearBoard(true);
          return TIME_LIMIT;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    setTimerId(timer);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [level]);

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
    console.log('highlight', highlight)
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
    setHighlight(0);
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
    if (left === right) {
      setScore(prev => prev + left + clicked.length);
      setConfirm('Correct :)');
      setHistory(prev => [{equation: expr.join(' '), correct: true, score: left + clicked.length}, ...(prev.slice(0,3))]);
    } else {
      setScore(prev => prev - Math.pow(10, level - 1));
      setConfirm('Incorrect :(');
      setLives(prev => prev - 1);
      setHistory(prev => [{equation: expr.join(' '), correct: false, score: Math.pow(10, level - 1)}, ...(prev.slice(0,3))]);
    }
    clearBoard(true);
  }

  return (
    <div className={styles.container}>
      <div className={styles.rowFullWidth}>
        <h1>PαthMαth</h1>
      </div>
      <div className={styles.row}>
        <div className={styles.column}>
          <div className={styles.expression}>
            {expression.length > 0 ? expression.join(' ') : "Click on the squares to start typing an expression!"}
          </div>
          <div
            className={styles.board}
            style={{
              gridTemplateColumns: `repeat(${level * 2 + 3}, 60px)`,
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
          <div className={styles.timerBar}>
            <div 
              className={styles.timerFill}
              style={{
                width: `${(timeLeft / TIME_LIMIT) * 100}%`,
                backgroundColor: timeLeft > 5 ? '#4CAF50' : timeLeft > 2 ? 'orange' : '#f44336',
                height: '10px',
                transition: 'width 1s linear',
                borderRadius: '5px'
              }}
            />
          </div>
          <div className={styles.buttonGroup}>
            <Button onClick={() => clearBoard(false)}>Clear</Button>
            <Button
              onClick={() => verify(expression)}
              disabled={!expression.includes('=')}
            >
              Evaluate
            </Button>
          </div>
          <div className={styles.expression} style={{color: confirm === 'Correct :)' ? 'limegreen' : 'red'}}>
            {confirm.length > 0 ? confirm : 'Click "Evaluate" to submit your equation!'}
          </div>
        </div>
        <div className={styles.column}>
          <History history={history} score={score} lives={lives}/>
        </div>
      </div>
    </div>
  );
}
