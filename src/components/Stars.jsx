import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Stars({ count = 80 }) {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const newStars = Array.from({ length: count }, () => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 1, // size 1px to 3px
      delay: Math.random() * 2, // twinkle delay
    }));
    setStars(newStars);
  }, [count]);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            delay: star.delay,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: star.y,
            left: star.x,
            width: star.size,
            height: star.size,
            borderRadius: '50%',
            backgroundColor: 'white',
          }}
        />
      ))}
    </div>
  );
}
