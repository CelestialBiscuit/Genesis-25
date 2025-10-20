import React, { useState, useEffect } from 'react';
import { auth, ensureUserProfile } from '../firebase';
import { motion } from 'framer-motion';
import { Stars } from './Stars'; 

export default function HandleDetails({ profile }) {
  const [name, setName] = useState(profile?.name || '');
  const [enrollment, setEnrollment] = useState(profile?.enrollment || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [trail, setTrail] = useState([]);

  // Cursor trail effect
  useEffect(() => {
    const handleMove = (e) => {
      const newDot = { id: Math.random(), x: e.clientX, y: e.clientY };
      setTrail(prev => [...prev.slice(-8), newDot]);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const showNotification = (message, type = 'success', duration = 3000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    // Basic empty field check
    if (!name || !enrollment || !phone) {
      setError('Please fill all fields');
      return;
    }

    // Enrollment validation: exactly 11 digits
    if (!/^\d{11}$/.test(enrollment)) {
      setError('Enter a valid IGDTUW enrollment number');
      return;
    }

    // Phone validation: exactly 9 digits
    if (!/^\d{9}$/.test(phone)) {
      setError('Enter a valid phone number (without country code)');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await ensureUserProfile(auth.currentUser.uid, {
        name,
        enrollment,
        phone,
        email: auth.currentUser.email,
      });

      showNotification('Details saved successfully! Redirecting...', 'success');

      // redirect after short delay
      setTimeout(() => {
        window.location.href = 'https://celestialbiscuit.vercel.app/';
      }, 2500);

    } catch (e) {
      showNotification(`Error: ${e.message}`, 'error');
    }

    setLoading(false);
  };


  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-6 relative">
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

      {/* Notification popup */}
      {notification && (
        <div
          className={`fixed top-8 right-2 transform -translate-x-1/2 px-6 py-3 rounded-2xl font-poppins text-sm sm:text-base font-semibold
            ${notification.type === 'success' ? 'bg-yellow-400 bg-opacity-60 text-black shadow-[0_0_20px_rgba(255,255,150,0.6)]' :
            'bg-rose-500 text-white shadow-[0_0_20px_rgba(255,50,50,0.6)]'}
            animate-fade-in`}
          style={{ zIndex: 9999 }}
        >
          {notification.message}
        </div>
      )}

      <div className="w-full max-w-lg sm:max-w-md p-6 sm:p-8 mx-auto">
        <h2 className="font-poppins font-thin text-3xl sm:text-4xl text-yellow-100 drop-shadow-[0_0_10px_rgba(255,255,200,0.4)] mb-2 sm:mb-3">
          Congratulations, Meridian!
        </h2>
        <p className="text-yellow-200 mb-6 text-sm sm:text-base">
          Enter your details to start your journey with us.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="w-full p-3 rounded-xl bg-black/20 border border-yellow-300 placeholder-yellow-100 focus:outline-none focus:ring-1 focus:ring-yellow-200 font-poppins"
          />
          <input
            value={enrollment}
            onChange={(e) => setEnrollment(e.target.value)}
            placeholder="Enrollment number"
            className="w-full p-3 rounded-xl bg-black/20 border border-yellow-300 placeholder-yellow-100 focus:outline-none focus:ring-1 focus:ring-yellow-200 font-poppins"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            className="w-full p-3 rounded-xl bg-black/20 border border-yellow-300 placeholder-yellow-100 focus:outline-none focus:ring-1 focus:ring-yellow-200 font-poppins"
          />
          {error && <div className="text-rose-400 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition"
          >
            {loading ? 'Saving...' : 'Save Details'}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className='absolute bottom-2 text-yellow-200 text-xs sm:text-sm'>
        CELESTIAL BISCUIT IGDTUW ⓒ 2025
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
