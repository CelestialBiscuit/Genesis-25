import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp, faInstagram, faSpotify } from "@fortawesome/free-brands-svg-icons";
import { Stars } from './Stars'; 

export default function MagicWords({ onSuccess }) {
  const [attempt, setAttempt] = useState('');
  const [msg, setMsg] = useState(null);
  const [trail, setTrail] = useState([]);
  const MAGIC = 'CONSTELLATION'; //change karlena 

  // Cursor trail effect
  useEffect(() => {
    const handleMove = (e) => {
      const newDot = { id: Math.random(), x: e.clientX, y: e.clientY };
      setTrail(prev => [...prev.slice(-8), newDot]);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const tryMagic = (e) => {
    e.preventDefault();
    if (attempt.trim().toUpperCase() === MAGIC) {
      setMsg('Yay— correct! You can now begin.');
      setTimeout(() => onSuccess(), 600);
    } else {
      setMsg('Not quite. Care to listen to a song while you figure it out?');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center">
      {/* Twinkling stars background */}
      <Stars count={120} />

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

      {/* Title and instructions */}
      <div className="relative rounded-3xl max-w-lg mx-auto">
        <h1 className="font-poppins font-thin text-5xl text-yellow-100 tracking-widest drop-shadow-[0_0_10px_rgba(255,255,200,0.4)] mb-4">
          CELESTIAL<br />CROSSWORD
        </h1>
      <p className="text-yellow-300 mb-4 sm:mb-6 text-sm sm:text-base">
        Type the cosmic password to unlock the puzzle
      </p>
      </div>

      {/* Input and button */}
      <form onSubmit={tryMagic} className="w-full max-w-xs sm:max-w-sm">
        <input
          value={attempt}
          onChange={e => setAttempt(e.target.value)}
          placeholder="Enter the magic words"
          className="w-full p-3 rounded-xl bg-black/30 border border-yellow-400 placeholder-yellow-100 focus:outline-none focus:ring-1 focus:ring-yellow-200 mb-4 font-poppins text-thin"
        />
        <button className="w-full py-3 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-200 transition">
          Unlock
        </button>
      </form>

      {/* Message */}
      {msg && <div className="mt-4 text-yellow-200 text-sm sm:text-base">{msg}</div>}

      {/* Footer icons with glow on hover */}
      <footer className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-6 flex-nowrap justify-center w-full max-w-xs sm:max-w-sm">
        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl sm:text-3xl text-yellow-200 hover:text-green-400 transition duration-300 hover:drop-shadow-[0_0_10px_rgba(0,255,0,0.8)]"
        >
          <FontAwesomeIcon icon={faWhatsapp} />
        </a>
        <a
          href="https://instagram.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl sm:text-3xl text-yellow-200 hover:text-pink-400 transition duration-300 hover:drop-shadow-[0_0_10px_rgba(255,0,128,0.8)]"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a
          href="https://open.spotify.com/user/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl sm:text-3xl text-yellow-200 hover:text-green-300 transition duration-300 hover:drop-shadow-[0_0_10px_rgba(0,255,128,0.8)]"
        >
          <FontAwesomeIcon icon={faSpotify} />
        </a>
      </footer>

      {/* Credit */}
      <div className='absolute bottom-2 text-yellow-200 text-xs sm:text-sm'>
        CELESTIAL BISCUIT IGDTUW ⓒ 2025
      </div>
    </div>
  );
}
