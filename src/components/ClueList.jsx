import React from 'react';

export const ClueList = ({ data, activeClue, onClueSelect }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
      {/* Across Clues */}
      <div className="space-y-3">
        <h3 className="text-xl font-light text-primary mb-4 tracking-widest">ACROSS</h3>
        <div className="space-y-2">
          {data.across.map((clue) => (
            <button
              key={`across-${clue.number}`}
              onClick={() => onClueSelect(clue)}
              className={`
                w-full text-left p-3 rounded-md
                transition-all duration-200
                hover:bg-primary/10 hover:translate-x-1
                ${
                  activeClue?.number === clue.number &&
                  activeClue?.direction === 'across'
                    ? 'bg-primary/20 cosmic-border'
                    : 'bg-card/30'
                }
              `}
            >
              <span className="text-primary font-medium mr-3">{clue.number}.</span>
              <span className="text-foreground/90 text-sm md:text-base">{clue.clue}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Down Clues */}
      <div className="space-y-3">
        <h3 className="text-xl font-light text-primary mb-4 tracking-widest">DOWN</h3>
        <div className="space-y-2">
          {data.down.map((clue) => (
            <button
              key={`down-${clue.number}`}
              onClick={() => onClueSelect(clue)}
              className={`
                w-full text-left p-3 rounded-md
                transition-all duration-200
                hover:bg-primary/10 hover:translate-x-1
                ${
                  activeClue?.number === clue.number &&
                  activeClue?.direction === 'down'
                    ? 'bg-primary/20 cosmic-border'
                    : 'bg-card/30'
                }
              `}
            >
              <span className="text-primary font-medium mr-3">{clue.number}.</span>
              <span className="text-foreground/90 text-sm md:text-base">{clue.clue}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
