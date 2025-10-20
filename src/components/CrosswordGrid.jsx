import React, { useRef, useEffect } from "react";

const CrosswordGrid = ({ grid, onCellChange, onCellSelect, selectedCell, activeClue, validation }) => {
  const inputRefs = useRef(grid.map(row => row.map(() => null)));

  const isCellInActiveWord = (row, col) => {
    if (!activeClue) return false;
    if (activeClue.direction === "across")
      return row === activeClue.row && col >= activeClue.col && col < activeClue.col + activeClue.answer.length;
    return col === activeClue.col && row >= activeClue.row && row < activeClue.row + activeClue.answer.length;
  };

  const moveToCell = (row, col) => {
    if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length && !grid[row][col].isBlack) {
      inputRefs.current[row][col]?.focus();
      onCellSelect(row, col);
    }
  };

  const moveNext = (row, col) => {
    if (!activeClue) return;
    if (activeClue.direction === "across" && col < activeClue.col + activeClue.answer.length - 1) moveToCell(row, col + 1);
    if (activeClue.direction === "down" && row < activeClue.row + activeClue.answer.length - 1) moveToCell(row + 1, col);
  };

  const movePrev = (row, col) => {
    if (!activeClue) return;
    if (activeClue.direction === "across" && col > activeClue.col) moveToCell(row, col - 1);
    if (activeClue.direction === "down" && row > activeClue.row) moveToCell(row - 1, col);
  };

  const handleKeyDown = (e, row, col) => {
    const cell = grid[row][col];
    if (e.key === "Backspace") {
      e.preventDefault();
      if (cell.letter) onCellChange(row, col, "");
      else movePrev(row, col);
    } else if (e.key === "ArrowLeft") { e.preventDefault(); moveToCell(row, col - 1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); moveToCell(row, col + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); moveToCell(row - 1, col); }
    else if (e.key === "ArrowDown") { e.preventDefault(); moveToCell(row + 1, col); }
  };

  const handleInput = (e, row, col) => {
    const value = e.target.value.toUpperCase().slice(-1);
    if (/^[A-Z]$/.test(value)) {
      onCellChange(row, col, value);
      moveNext(row, col);
    }
  };

  useEffect(() => {
    if (selectedCell) inputRefs.current[selectedCell.row][selectedCell.col]?.focus();
  }, [selectedCell]);

  return (
      <div className="flex justify-center p-2 w-full max-w-full">
        <div
          className="inline-grid gap-1 p-2 rounded-xl border border-yellow-400 bg-black/30 backdrop-blur-sm cosmic-border"
          style={{
            gridTemplateColumns: `repeat(${grid[0].length}, minmax(24px, 1fr))`,
          }}
        >

        {grid.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
            const isInActiveWord = isCellInActiveWord(rowIndex, colIndex);
            const validationState = validation?.[rowIndex]?.[colIndex];

            return (
              <div key={`${rowIndex}-${colIndex}`} className="relative">
                {cell.isBlack ? (
                  <div className="w-full aspect-square bg-gray-600 bg-opacity-20" />
                ) : (
                  <div className="relative w-full aspect-square">
                    {cell.number && (
                      <span className="absolute top-0.5 left-1 text-[10px] font-light text-yellow-400 z-10">
                        {cell.number}
                      </span>
                    )}
                    <input
                      ref={el => inputRefs.current[rowIndex][colIndex] = el}
                      type="text"
                      maxLength={1}
                      value={cell.letter}
                      onChange={e => handleInput(e, rowIndex, colIndex)}
                      onKeyDown={e => handleKeyDown(e, rowIndex, colIndex)}
                      onClick={() => onCellSelect(rowIndex, colIndex)}
                      className={`
                        w-full h-full text-center text-lg md:text-xl font-light uppercase rounded-md
                        bg-neutral-800 text-yellow-100 border border-yellow-400
                        focus:outline-none focus:ring-2 focus:ring-yellow-400
                        ${isSelected ? 'ring-2 ring-yellow-400 bg-yellow-900/40' : ''}
                        ${isInActiveWord && !isSelected ? 'bg-yellow-800/30' : ''}
                        ${validationState === 'correct' ? 'bg-green-800/30 border-green-500' : ''}
                        ${validationState === 'incorrect' ? 'bg-red-800/30 border-red-500' : ''}
                        hover:bg-yellow-700/30 transition-all duration-200
                      `}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CrosswordGrid;
