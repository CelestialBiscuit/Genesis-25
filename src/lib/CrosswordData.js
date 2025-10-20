// lib/CrosswordData.js

export const sampleClues = [
  { number: 1, clue: 'Shines in the sky', answer: 'SUN', row: 0, col: 0, direction: 'across' },
  { number: 2, clue: 'Opposite of night', answer: 'DAY', row: 1, col: 0, direction: 'across' },
  { number: 3, clue: 'Type of manmade thread', answer: 'NYLONNYL', row: 0, col: 2, direction: 'down' },
];

export const createEmptyGrid = (rows = 8, cols = 8) => {
  const grid = Array(rows)
    .fill(null)
    .map(() =>
      Array(cols).fill(null).map(() => ({ letter: '', isBlack: true }))
    );

  sampleClues.forEach(clue => {
    const { row, col, answer, direction, number } = clue;
    for (let i = 0; i < answer.length; i++) {
      const r = direction === 'down' ? row + i : row;
      const c = direction === 'across' ? col + i : col;
      grid[r][c] = { letter: '', isBlack: false, number: i === 0 ? number : undefined };
    }
  });

  return grid;
};
