export const sampleClues = [
  // Across
  { number: 4, clue: 'Famous last words: It works on my ____(7)', answer: 'MACHINE', row: 2, col: 0, direction: 'across' },
  { number: 5, clue: 'Department where the founders first cast their code spells (2)', answer: 'IT', row: 2, col: 9, direction: 'across' },
  { number: 6, clue: 'Hackathon where data structures aligned perfectly (7)', answer: 'EQUINOX', row: 4, col: 5, direction: 'across' },
  { number: 7, clue: 'Presidents of the biscuit galaxy (7)', answer: 'SOLARIS', row: 6, col: 5, direction: 'across' },
  // Down
  { number: 1, clue: 'Campus overrun by these furry invaders (7)', answer: 'MONKEYS', row: 0, col: 5, direction: 'down' },
  { number: 2, clue: 'Keeping track of all your versions? Commit it to ___ (3)', answer: 'GIT', row: 0, col: 10, direction: 'down' },
  { number: 3, clue: 'Not human, answers to genius billionaire playboy philanthropist (6)', answer: 'JARVIS', row: 1, col: 1, direction: 'down' },
  { number: 5, clue: 'Tech festival that once caused cosmic collisions (7)', answer: 'INNERVE', row: 2, col: 9, direction: 'down' },
];

export const createEmptyGrid = (rows = 9, cols = 12) => {
  const grid = Array(rows)
    .fill(null)
    .map(() =>
      Array(cols).fill(null).map(() => ({ letter: '', isBlack: true, numbers: [] }))
    );

  sampleClues.forEach(clue => {
    const { row, col, answer, direction, number } = clue;

    for (let i = 0; i < answer.length; i++) {
      const r = direction === 'down' ? row + i : row;
      const c = direction === 'across' ? col + i : col;

      if (grid[r][c].isBlack) grid[r][c].isBlack = false;

      if (!grid[r][c].letter) grid[r][c].letter = '';

      if (i === 0) {
        if (!grid[r][c].numbers) grid[r][c].numbers = [];
        if (!grid[r][c].numbers.includes(number)) grid[r][c].numbers.push(number);
      }
    }
  });

  grid.forEach(row => row.forEach(cell => {
    if (cell.numbers && cell.numbers.length > 0) {
      cell.number = cell.numbers.join(',');
    }
  }));

  return grid;
};

