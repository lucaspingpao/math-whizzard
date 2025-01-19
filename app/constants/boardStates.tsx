import { SquareState } from '../types/types';

export const levelSizes = new Map([
  [1, 5],
  [2, 5],
  [3, 7],
  [4, 7], 
  [5, 9],
  [6, 9]
]);

const TOTAL_LEVELS = 6;
const boards: SquareState[][][] = Array(TOTAL_LEVELS).fill(null).map((_, i) => 
  Array(levelSizes.get(i + 1)).fill(null).map(() =>
    Array(levelSizes.get(i + 1)).fill(null).map(() => 
      ({ color: '#ffffff', val: '0' })
    )
  )
);


// Level 1
boards[0][1][3] = {color: '#ffffff', val: '='};
boards[0][3][1] = {color: '#ffffff', val: '='};

boards[0][1][1] = {color: '#ffffff', val: '+'};
boards[0][3][3] = {color: '#ffffff', val: '+'};

// Level 2
boards[1][1][3] = {color: '#ffffff', val: '='};
boards[1][3][1] = {color: '#ffffff', val: '='};

boards[1][1][1] = {color: '#ffffff', val: '+'};
boards[1][3][3] = {color: '#ffffff', val: '−'};

// Level 3
boards[2][1][1] = {color: '#ffffff', val: '='};
boards[2][1][5] = {color: '#ffffff', val: '='};
boards[2][5][1] = {color: '#ffffff', val: '='};
boards[2][5][5] = {color: '#ffffff', val: '='};
boards[2][3][3] = {color: '#ffffff', val: '='};

boards[2][1][3] = {color: '#ffffff', val: '+'};
boards[2][5][3] = {color: '#ffffff', val: '−'};
boards[2][3][1] = {color: '#ffffff', val: '+'};
boards[2][3][5] = {color: '#ffffff', val: '−'};

// Level 4
boards[3][1][1] = {color: '#ffffff', val: '='};
boards[3][1][5] = {color: '#ffffff', val: '='};
boards[3][5][1] = {color: '#ffffff', val: '='};
boards[3][5][5] = {color: '#ffffff', val: '='};
boards[3][3][3] = {color: '#ffffff', val: '='};

boards[3][1][3] = {color: '#ffffff', val: '+'};
boards[3][5][3] = {color: '#ffffff', val: '−'};
boards[3][3][1] = {color: '#ffffff', val: '×'};
boards[3][3][5] = {color: '#ffffff', val: '÷'};

// Level 5
boards[4][1][1] = {color: '#ffffff', val: '='};
boards[4][1][7] = {color: '#ffffff', val: '='};
boards[4][7][1] = {color: '#ffffff', val: '='};
boards[4][7][7] = {color: '#ffffff', val: '='};

boards[4][3][3] = {color: '#ffffff', val: '='};
boards[4][3][5] = {color: '#ffffff', val: '='};
boards[4][5][3] = {color: '#ffffff', val: '='};
boards[4][5][5] = {color: '#ffffff', val: '='};

boards[4][1][3] = {color: '#ffffff', val: '+'};
boards[4][1][5] = {color: '#ffffff', val: '+'};
boards[4][7][3] = {color: '#ffffff', val: '+'};
boards[4][7][5] = {color: '#ffffff', val: '+'};
boards[4][3][1] = {color: '#ffffff', val: '−'};
boards[4][5][1] = {color: '#ffffff', val: '−'};
boards[4][3][7] = {color: '#ffffff', val: '−'};
boards[4][5][7] = {color: '#ffffff', val: '−'};
boards[4][4][4] = {color: '#ffffff', val: '×'};

// Level 6
boards[5][1][1] = {color: '#ffffff', val: '='};
boards[5][1][7] = {color: '#ffffff', val: '='};
boards[5][7][1] = {color: '#ffffff', val: '='};
boards[5][7][7] = {color: '#ffffff', val: '='};

boards[5][3][3] = {color: '#ffffff', val: '='};
boards[5][3][5] = {color: '#ffffff', val: '='};
boards[5][5][3] = {color: '#ffffff', val: '='};
boards[5][5][5] = {color: '#ffffff', val: '='};

boards[5][1][3] = {color: '#ffffff', val: '+'};
boards[5][1][5] = {color: '#ffffff', val: '+'};
boards[5][7][3] = {color: '#ffffff', val: '−'};
boards[5][7][5] = {color: '#ffffff', val: '−'};
boards[5][3][1] = {color: '#ffffff', val: '×'};
boards[5][5][1] = {color: '#ffffff', val: '×'};
boards[5][3][7] = {color: '#ffffff', val: '÷'};
boards[5][5][7] = {color: '#ffffff', val: '÷'};
boards[5][4][4] = {color: '#ffffff', val: '×'};

export { boards };