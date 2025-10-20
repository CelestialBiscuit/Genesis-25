import React, { useState, useEffect } from "react";
import CrosswordGrid from "./CrosswordGrid";
import { sampleClues, createEmptyGrid } from "../lib/CrosswordData";
import { Stars } from './Stars'; 
import { motion } from "framer-motion";
import confetti from "canvas-confetti";


const Crossword = ({ profile, onComplete }) => {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [selectedCell, setSelectedCell] = useState(null);
  const [activeClue, setActiveClue] = useState(null);
  const [validation, setValidation] = useState(null);
  const [trail, setTrail] = useState([]);
  const [notification, setNotification] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Cursor trail
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
    
    if (allCorrect) {
      // Confetti burst yay!
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
      });

      setSuccessMessage("Amazing job! Redirecting..");

      setTimeout(() => {
        setSuccessMessage(null);
        onComplete();
      }, 2000); 
    }

    else {
      setNotification("Some answers are wrong. Try again!");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 text-yellow-200 relative overflow-hidden">
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

      {/* Twinkling stars */}
      <Stars count={120} />

      {/* Title */}
      <h1 className="font-poppins font-thin text-3xl xs:text-4xl sm:text-5xl text-yellow-100 drop-shadow-[0_0_10px_rgba(255,255,200,0.4)] mb-2 text-center leading-snug mt-8">
        CELESTIAL CROSSWORD
      </h1>
      <p className="text-amber-300 text-sm xs:text-base sm:text-lg mb-4 text-center">
        A little cosmic brain stretch
      </p>

      {/* Crossword Grid */}
      <div className="w-full max-w-[90vw] sm:max-w-lg">
        <CrosswordGrid
          grid={grid}
          onCellChange={handleCellChange}
          onCellSelect={handleCellSelect}
          selectedCell={selectedCell}
          activeClue={activeClue}
          validation={validation}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-4 sm:mt-6 w-full sm:w-auto px-4 sm:px-6 py-3 bg-yellow-400 text-black rounded-xl hover:bg-yellow-300 transition duration-300"
      >
        Submit
      </button>

      {/* Notification */}
      {notification && (
        <div className="fixed top-10 right-2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out z-50">
          {notification}
        </div>
      )}
      
      {successMessage && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out">
          {successMessage}
        </div>
      )}

      {/* Across & Down Hints */}
      <div className="mt-6 w-full flex flex-col md:flex-row justify-between gap-4 md:gap-10 overflow-x-auto">
        {['across', 'down'].map(dir => (
          <div key={dir} className="flex-1 flex flex-col gap-2 min-w-[150px]">
            <h2 className="text-lg sm:text-xl font-thin mb-1 text-yellow-100">{dir.toUpperCase()}</h2>
            <div className="flex flex-col gap-1">
              {sampleClues.filter(c => c.direction === dir).map(c => (
                <div
                  key={c.number}
                  className="bg-black/30 p-2 rounded-md transition duration-200 text-white flex items-start gap-2"
                >
                  <span className="text-yellow-200 font-semibold">{c.number}.</span>
                  <span className="text-sm sm:text-base">{c.clue}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Fade-in notification animation */}
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
