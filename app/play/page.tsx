"use client";

import { useState, useEffect, useRef } from 'react';
import Square from '../components/Square';
import styles from '../styles/PlayGame.module.css';
import History from '../components/History';
import { SquareState, HistoryState } from '../types/types';
import boards, { levelSizes } from '../components/Boards';
import { Button, Input } from '@aws-amplify/ui-react';
import { useAuthenticator } from "@aws-amplify/ui-react";
import { FaSave } from 'react-icons/fa';
import Link from 'next/link';

export default function PlayGame() {
  const { user } = useAuthenticator();
  const NUM_LIVES = 3;
  const symbols = ['+', '−', '×', '÷', '='];
  const TIME_LIMIT = 2;

  const [level, setLevel] = useState<number>(1);
  const [board, setBoard] = useState<SquareState[][]>(boards[level - 1]);
  const [expression, setExpression] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(NUM_LIVES);
  const [clicked, setClicked] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [highlight, setHighlight] = useState<number>(4);
  const [timeLeft, setTimeLeft] = useState<number>(TIME_LIMIT);
  const timerRef = useRef<null | ReturnType<typeof setInterval>>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('not found');
  const [saved, setSaved] = useState<string>('Click save to change your username');

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const getUsername = () => {
    const apiUrl = 'https://smwylkwm55.execute-api.us-east-2.amazonaws.com/default/users';
    fetch(apiUrl, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        const u = JSON.parse(data.body).data[0][3];
          console.log(u);
          setUsername(u);
        })
      .catch(error => console.error('Error:', error));
  }

  const handleChangeUsername = () => {
    const apiUrl = 'https://smwylkwm55.execute-api.us-east-2.amazonaws.com/default/users';
    fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: String(user.userId),
        username: userInput
      }),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
    setSaved(`Saved "${userInput}" as the new username!`)
    setUserInput('');
  };

  const startTimer = () => {
    if (gameOver) return;
    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      const elapsedTime = (Date.now() - startTime) / 1000;
      const remainingTime = TIME_LIMIT - elapsedTime;

      if (remainingTime <= 0) {
        clearInterval(timerRef.current!);
        setLives((prev) => Math.max(prev - 1, 0));
        if (lives === 1) {
          setGameOver(true);
          setTimeLeft(TIME_LIMIT);
        }
        resetTimer();
        setConfirm('Timeout! You lost a life 💔')
        initializeBoard();
      } else {
        setTimeLeft(remainingTime);
      }
    }, 100);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(TIME_LIMIT);
    startTimer();
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [lives]);

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
    getUsername();
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
    resetTimer();
    const indexOfEquals = expr.indexOf('=');
    const left = evaluate(expr.slice(0, indexOfEquals))
    const right = evaluate(expr.slice(indexOfEquals + 1));
    const newHistory = history.slice(-5).map(item => ({...item, isNew: false}));
    let newScore = score;
    if (left === right) {
      newScore += left + clicked.length;
      setScore(newScore);
      setConfirm('Correct :)');
      setHistory([
        ...newHistory,
        { equation: expr.join(' '), correct: true, score: left + clicked.length, isNew: true }
      ]);
      
    } else {
      const penalty = Math.pow(10, ((levelSizes.get(level) ?? 3) - 3) / 2);
      newScore -= penalty;
      setScore(newScore);
      setConfirm('Incorrect :(');
      setLives((prev) => Math.max(prev - 1, 0));
      setHistory([
        ...newHistory,
        {equation: expr.join(' '), correct: false, score: penalty, isNew: true}
      ]);
      if (lives === 1) {
        setGameOver(true);
      }
    }
    clearBoard(true);
    levelUp(newScore);
  }

  const scoreMap = new Map<number, number>([
    [1, 100],
    [2, 200],
    [3, 1000],
    [4, 5000],
    [5, 100000],
    [6, 800000]
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
    <div className={styles.container}>
      <div className={styles.rowFullWidth}>
        <h1>PαthMαth</h1>
      </div>
      <div className={styles.row}>
        {!gameOver ?
        <div className={styles.column}>
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
        :
        <div className={styles.column}>
          <h1 className={styles.gameOverTitle}>Game over!</h1>
          <p className={styles.finalScore}>Final score: {score}</p>
          <p className={styles.usernameDisplay}>Your current username is: {username}</p>
          <div className={styles.inputLine}>
            <Input
              className={styles.usernameInput}
              value={userInput}
              placeholder="Type a new username here:"
              onChange={handleInput}
            />
            <Button onClick={handleChangeUsername} disabled={userInput.length === 0}>
              Save&nbsp;<FaSave />
            </Button>
          </div>
          <div className={styles.savedMessage}>{saved.length > 0 && saved}</div>

          <div className={styles.buttonGroup}>
            <Button 
              className={styles.playAgainButton}
              onClick={() => {
                setGameOver(false);
                setLevel(1);
                setBoard(boards[0]);
                setScore(0);
                setLives(NUM_LIVES);
                setHistory([]);
                initializeBoard();
                getUsername();
                setSaved('Click save to change your username')
              }}
            >
              Play again?
            </Button>
            <Link href="/stats">
              <Button
                className={styles.statsButton}
              >
                View Stats
              </Button>
            </Link>
          </div>
        </div>}
        <div className={styles.column}>
          <History history={history} totalScore={score} lives={lives} level={level}/>
        </div>
      </div>
    </div>
  );
}

