import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { signInWithGoogle } from "../firebase";
import { Stars } from './Stars'; 

export default function Signup({ onSignedIn }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trail, setTrail] = useState([]);

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await signInWithGoogle();
      onSignedIn(user, null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // 🟡 Cursor trail logic
  useEffect(() => {
    const handleMove = (e) => {
      const newDot = {
        id: Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      setTrail((prev) => [...prev.slice(-8), newDot]); // keep last 8 for fading trail
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-center">
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

      <div className="relative p-10 rounded-3xl max-w-lg mx-auto">
        <h1 className="font-poppins font-thin text-5xl text-yellow-100 tracking-widest drop-shadow-[0_0_10px_rgba(255,255,200,0.4)] mb-4">
          CELESTIAL<br />CROSSWORD
        </h1>

        <p className="text-yellow-400 mb-10 text-base">
          Sign in to access the cosmic puzzle
        </p>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className={`flex items-center justify-center w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-xl transition duration-300 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <span className="mr-2 text-lg">G</span>
          {loading ? "Signing in..." : "SIGN IN WITH GOOGLE"}
        </button>

        {error && <div className="text-rose-500 mt-4">{error}</div>}

        <p className="text-gray-500 text-sm mt-4">
          © Celestial Biscuit IGDTUW | Crafted with curiosity
        </p>
      </div>
    </div>
  );
}
