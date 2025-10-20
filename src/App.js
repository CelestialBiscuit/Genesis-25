import React, { useState, useEffect } from 'react';
import Signup from './components/Signup';
import MagicWords from './components/MagicWords';
import Crossword from './components/Crossword';
import HandleDetails from './components/HandleDetails';
import { auth } from './firebase';

function App() {
  const [stage, setStage] = useState('signup'); // signup -> magic -> game -> details
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  // Make the grid reactive
  const [grid, setGrid] = useState([
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
  ]);

  const [crosswordCompleted, setCrosswordCompleted] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => {
      setUser(u);
      if (!u) setStage('signup');
    });
    return unsub;
  }, []);

  // Sample clues
  const sampleClues = {
    across: [
      { number: 1, clue: "Shines in the sky", answer: "SUN", row: 0, col: 0, direction: 'across' },
      { number: 2, clue: "Opposite of night", answer: "DAY", row: 1, col: 1, direction: 'across' },
    ],
    down: [
      { number: 1, clue: "Bright celestial body", answer: "STAR", row: 0, col: 0, direction: 'down' },
    ]
  };

  const handleCellChange = (row, col, value) => {
    setGrid(prev => {
      const newGrid = prev.map(r => r.map(c => ({ ...c })));
      newGrid[row][col].letter = value;
      return newGrid;
    });
  };

  const handleCellSelect = (row, col) => {
    console.log('Selected:', row, col);
  };

  return (
    <div className="celestial-page">
      <div className="max-w-4xl w-full">
        {/* {stage === 'signup' && (
          <Signup onSignedIn={(u, p) => { setUser(u); setProfile(p); setStage('magic'); }} />
        )} */}
        {stage === 'magic' && (
          <MagicWords onSuccess={() => setStage('game')} profile={profile} />
        )}
        {stage === 'signup' && (
          <Crossword
            profile={profile}
            grid={grid}
            clues={sampleClues}
            onCellChange={handleCellChange}
            onCellSelect={handleCellSelect}
            onComplete={() => setStage('details')}
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
