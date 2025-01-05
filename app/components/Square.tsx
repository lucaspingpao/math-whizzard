import styles from '../styles/Square.module.css';

interface SquareProps {
  color: string;
  val: string;
  onClick: () => void;
}

export default function Square({ color, val, onClick }: SquareProps) {
  return (
    <div
      onClick={onClick}
      className={['+', '−', '×', '÷', '='].includes(val) ? styles.specialSquare : styles.square}
      style={{ backgroundColor: color }}
    >
      {val}
    </div>
  );
}
