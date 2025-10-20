import React, { useState, useEffect } from 'react';
import Signup from './components/Signup';
import MagicWords from './components/MagicWords';
import Crossword from './components/Crossword';
import HandleDetails from './components/HandleDetails';
import { auth } from './firebase';

function App() {
  const [stage, setStage] = useState(() => localStorage.getItem('stage') || 'signup');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const defaultGrid = [
    [
      { letter: '', isBlack: false, number: 1 },
      { letter: '', isBlack: false },
      { letter: '', isBlack: true },
    ],
    [
      { letter: '', isBlack: false },
      { letter: '', isBlack: false, number: 2 },
      { letter: '', isBlack: false },
    ],
    [
      { letter: '', isBlack: true },
      { letter: '', isBlack: false },
      { letter: '', isBlack: false },
    ],
  ];

  const [grid, setGrid] = useState(() => {
    const saved = localStorage.getItem('crosswordGrid');
    return saved ? JSON.parse(saved) : defaultGrid;
  });

  const [crosswordCompleted, setCrosswordCompleted] = useState(false);

  // Auto-save grid progress
  useEffect(() => {
    if (stage === 'game') {
      localStorage.setItem('crosswordGrid', JSON.stringify(grid));
    }
  }, [grid, stage]);

  const handleCrosswordComplete = () => {
    localStorage.removeItem('crosswordGrid');
    setStage('details');
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => {
      setUser(u);
      setLoadingAuth(false);

      if (u) {
        const savedStage = localStorage.getItem('stage');
        setStage(savedStage || 'magic');
      } else {
        setStage('signup');
      }
    });

    return unsub;
  }, []);

 useEffect(() => {
  if (stage === 'details') {
    // Game finished → clear progress and next time start fresh
    localStorage.removeItem('stage');
    localStorage.removeItem('crosswordGrid');
  } else if (stage) {
    localStorage.setItem('stage', stage);
  }
}, [stage]);


  const sampleClues = {
    across: [
      { number: 4, clue: 'Famous last words: It works on my ____(7)', answer: 'MACHINE', row: 2, col: 0, direction: 'across' },
      { number: 5, clue: 'Department where the founders first cast their code spells (2)', answer: 'IT', row: 2, col: 9, direction: 'across' },
      { number: 6, clue: 'Hackathon where data structures aligned perfectly (7)', answer: 'EQUINOX', row: 4, col: 5, direction: 'across' },
      { number: 7, clue: 'Presidents of the biscuit galaxy (7)', answer: 'SOLARIS', row: 6, col: 5, direction: 'across' },
    ],
    down: [
      { number: 1, clue: 'Campus overrun by these furry invaders (7)', answer: 'MONKEYS', row: 0, col: 5, direction: 'down' },
      { number: 2, clue: 'Keeping track of all your versions? Commit it to ___ (3)', answer: 'GIT', row: 0, col: 10, direction: 'down' },
      { number: 3, clue: 'Not human, answers to genius billionaire playboy philanthropist (6)', answer: 'JARVIS', row: 1, col: 1, direction: 'down' },
      { number: 5, clue: 'Tech festival that once caused cosmic collisions (7)', answer: 'INNERVE', row: 2, col: 9, direction: 'down' },
    ],
  };

  const handleCellChange = (row, col, value) => {
    setGrid(prev => {
      const newGrid = prev.map(r => r.map(c => ({ ...c })));
      newGrid[row][col].letter = value;
      return newGrid;
    });
  };

  if (loadingAuth) return <div>Loading...</div>;

  return (
    <div className="celestial-page">
      <div className="max-w-4xl w-full">
        {stage === 'signup' && (
          <Signup onSignedIn={(u, p) => { setUser(u); setProfile(p); setStage('magic'); }} />
        )}
        {stage === 'magic' && (
          <MagicWords onSuccess={() => setStage('game')} profile={profile} />
        )}
        {stage === 'game' && (
          <Crossword
            profile={profile}
            grid={grid}
            clues={sampleClues}
            onCellChange={handleCellChange}
            onComplete={handleCrosswordComplete}
          />
        )}
        {stage === 'details' && (
          <HandleDetails profile={profile} />
        )}
      </div>
    </div>
  );
}

export default App;
