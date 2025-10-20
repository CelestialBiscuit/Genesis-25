import React, { useState, useEffect } from "react";
import CrosswordGrid from "./CrosswordGrid";
import { sampleClues, createEmptyGrid } from "../lib/CrosswordData";
import { Stars } from './Stars'; 
import { motion } from "framer-motion";

const Crossword = ({ profile, onComplete }) => {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [selectedCell, setSelectedCell] = useState(null);
  const [activeClue, setActiveClue] = useState(null);
  const [validation, setValidation] = useState(null);
  const [trail, setTrail] = useState([]);
  const [notification, setNotification] = useState(null);

  // Cursor trail effect
  useEffect(() => {
    const handleMove = (e) => {
      const newDot = { id: Math.random(), x: e.clientX, y: e.clientY };
      setTrail(prev => [...prev.slice(-8), newDot]);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const handleCellChange = (row, col, value) => {
    setGrid(prev => {
      const newGrid = prev.map(r => r.map(c => ({ ...c })));
      newGrid[row][col].letter = value;
      return newGrid;
    });
  };

  const handleCellSelect = (row, col) => {
    setSelectedCell({ row, col });
    const clue = sampleClues.find(c => {
      if (c.direction === 'across') return row === c.row && col >= c.col && col < c.col + c.answer.length;
      return col === c.col && row >= c.row && row < c.row + c.answer.length;
    });
    setActiveClue(clue || null);
  };

  const handleSubmit = () => {
    const newValidation = grid.map(row => row.map(c => null));
    let allCorrect = true;

    sampleClues.forEach(clue => {
      const { row, col, answer, direction } = clue;
      for (let i = 0; i < answer.length; i++) {
        const r = direction === 'down' ? row + i : row;
        const c = direction === 'across' ? col + i : col;
        if (grid[r][c].letter.toUpperCase() === answer[i].toUpperCase()) newValidation[r][c] = 'correct';
        else { newValidation[r][c] = 'incorrect'; allCorrect = false; }
      }
    });

    setValidation(newValidation);

    if (allCorrect) onComplete();
    else {
      setNotification("Some answers are wrong. Try again!");
      setTimeout(() => setNotification(null), 3000); // hide after 3 seconds
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-yellow-200 relative overflow-x-auto">
      {/* Cursor trail */}
      {trail.map((dot, index) => (
        <motion.div
          key={dot.id}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="pointer-events-none fixed rounded-full bg-yellow-400 mix-blend-screen blur-md"
          style={{
            width: 12,
            height: 12,
            left: dot.x - 6,
            top: dot.y - 6,
            opacity: 0.6 - index * 0.06,
          }}
        />
      ))}

      {/* Twinkling stars background */}
      <Stars count={120} />

      <h1 className="font-poppins font-thin text-5xl text-yellow-100 drop-shadow-[0_0_10px_rgba(255,255,200,0.4)] mb-4 mt-6 text-center">
        CELESTIAL CROSSWORD
      </h1>
      <p className="text-amber-300 sm:text-xl mb-6 text-center">
        A little cosmic brain stretch
      </p>

      <CrosswordGrid
        grid={grid}
        onCellChange={handleCellChange}
        onCellSelect={handleCellSelect}
        selectedCell={selectedCell}
        activeClue={activeClue}
        validation={validation}
      />

      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-3 bg-yellow-400 text-black rounded-xl hover:bg-yellow-300 transition duration-300"
      >
        Submit
      </button>

      {/* Notification */}
      {notification && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out z-50">
          {notification}
        </div>
      )}

      {/* Across & Down hints */}
      <div className="mt-6 w-full flex flex-col md:flex-row justify-between gap-10">
        {['across', 'down'].map(dir => (
          <div key={dir} className="flex-1 flex flex-col gap-4">
            <h2 className="text-[1.3rem] font-thin mb-2 text-yellow-100">{dir.toUpperCase()}</h2>
            {sampleClues.filter(c => c.direction === dir).map(c => (
              <div
                key={c.number}
                className="bg-black/30 p-2 rounded-md transition duration-200 text-white flex items-start gap-2"
              >
                <span className="text-yellow-200 font-semibold">{c.number}.</span>
                <span>{c.clue}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes fade-in-out {
            0% { opacity: 0; transform: translateY(-10px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
          }
          .animate-fade-in-out {
            animation: fade-in-out 3s ease forwards;
          }
        `}
      </style>
    </div>
  );
};

export default Crossword;
