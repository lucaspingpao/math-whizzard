import { SquareState } from '../types/types';

const TOTAL_LEVELS = 3;
const boards: SquareState[][][] = Array(TOTAL_LEVELS).fill(null).map((_, i) => 
  Array(i * 2 + 5).fill(null).map(() =>
    Array(i * 2 + 5).fill(null).map(() => 
      ({ color: '#ffffff', val: '0' })
    )
  )
);

// Level 1
boards[0][1][3] = {color: '#ffffff', val: '='};
boards[0][3][1] = {color: '#ffffff', val: '='};

boards[0][1][1] = {color: '#ffffff', val: '+'};
boards[0][3][3] = {color: '#ffffff', val: '−'};


// Level 2
boards[1][1][1] = {color: '#ffffff', val: '='};
boards[1][1][5] = {color: '#ffffff', val: '='};
boards[1][5][1] = {color: '#ffffff', val: '='};
boards[1][5][5] = {color: '#ffffff', val: '='};
boards[1][3][3] = {color: '#ffffff', val: '='};

boards[1][1][3] = {color: '#ffffff', val: '+'};
boards[1][5][3] = {color: '#ffffff', val: '−'};
boards[1][3][1] = {color: '#ffffff', val: '×'};
boards[1][3][5] = {color: '#ffffff', val: '÷'};

export default boards;