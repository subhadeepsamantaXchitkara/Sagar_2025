import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Anima.css';
// Ensure this path is correct relative to the location of IntroAnimation.js
import vibeMusic from '../public/vibe-music.mp3'; 
// --- Configuration and Colors ---
const NUM_ORBS = 20;
// Use window.innerWidth only after the component mounts or use a fallback
const ORBIT_RADIUS = Math.min(200, 200); // Fixed size for simplicity, or use a responsive hook
const ANIMATION_DURATION = 6.5;
const ORB_COLORS = [
  '#00FFFF', '#8B008B', '#00FFFF', '#8B008B', '#00FFFF',
  '#8B008B', '#00FFFF', '#8B008B', '#00FFFF', '#8B008B',
  '#00FFFF', '#8B008B', '#00FFFF', '#8B008B', '#00FFFF',
  '#8B008B', '#00FFFF', '#8B008B', '#00FFFF','#8B008B'
];

// --- Mute Icon Component ---
const MuteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.54 8.46C16.4816 9.40134 17.0039 10.6695 17.0039 11.995C17.0039 13.3205 16.4816 14.5887 15.54 15.53" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function IntroAnimation() {
  const [hasInteracted, setHasInteracted] = useState(false);
  const navigate = useNavigate();
  const audioRef = useRef(null);

  useEffect(() => {
    // Navigation Timer
    const navigationTimer = setTimeout(() => {
        navigate('/birthday');
    }, ANIMATION_DURATION * 1000);

    // Audio Fade-Out Timer
    const fadeOutTimer = setTimeout(() => {
        if (audioRef.current && !audioRef.current.paused) {
            let volume = audioRef.current.volume;
            const fadeOutInterval = setInterval(() => {
              // Ensure volume doesn't go below 0
              volume = Math.max(0, volume - 0.1); 
              audioRef.current.volume = volume;

              if (volume === 0) {
                clearInterval(fadeOutInterval);
                audioRef.current.pause();
              }
            }, 50);
        }
    }, (ANIMATION_DURATION * 1000) - 500); // Start fade-out 500ms before end

    return () => {
      clearTimeout(navigationTimer);
      clearTimeout(fadeOutTimer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset audio position
      }
    };
  }, [navigate]);

  // Handles the FIRST interaction (Autoplay Policy solution)
  const handleInteraction = () => {
    if (!hasInteracted && audioRef.current) {
      // On the first click, play the audio at a set volume
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(error => {
        console.error("Audio play failed:", error);
      });
      setHasInteracted(true);
    }
  };

  const orbs = [...Array(NUM_ORBS)];

  return (
    <AnimatePresence>
      {/* The entire container handles the initial interaction */}
      <div className="intro-container" onClick={handleInteraction}>
        
        {/* CORRECTED: Use the imported 'vibeMusic' variable */}
        <audio ref={audioRef} src={vibeMusic} loop />

        {/* Unmute Prompt */}
        {!hasInteracted && (
          <motion.div
            className="unmute-prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <MuteIcon />
            <span>Tap for sound</span>
          </motion.div>
        )}

        {/* Orbiting Orbs Animation */}
        {orbs.map((_, i) => {
          const angle = (i / NUM_ORBS) * 2 * Math.PI;
          const x = ORBIT_RADIUS * Math.cos(angle);
          const y = ORBIT_RADIUS * Math.sin(angle);
          const orbColor = ORB_COLORS[i % ORB_COLORS.length];
          return (
            <motion.div
              key={i}
              className="orb"
              style={{
                backgroundColor: orbColor,
                boxShadow: `0 0 20px ${orbColor}, 0 0 40px ${orbColor}, 0 0 60px ${orbColor}`
              }}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1.2, 1],
                x: [0, x * 1.5, x],
                y: [0, y * 1.5, y],
                transitionEnd: { x: 0, y: 0, scale: 0 },
              }}
              transition={{
                duration: 4,
                delay: 0.5,
                ease: 'circOut',
                times: [0, 0.5, 1],
              }}
            />
          );
        })}

        {/* Flash Effect */}
        <motion.div
          className="flash"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 60], opacity: [0, 1, 0] }}
          transition={{
            duration: 1.5,
            delay: 4,
            ease: 'easeIn',
            times: [0, 0.2, 1],
          }}
        />

        {/* Final Message */}
        <motion.div
          className="final-message-container"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1.1, 1, 0.9] }}
          transition={{
            duration: 5.5,
            delay: 4.2,
            ease: 'easeOut',
            times: [0, 0.4, 0.8, 1],
          }}
        >
          <h4 className="final-message-main">Another Orbit Complete</h4>
          <h6 className="final-message-sub">Time to Celebrate</h6>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default IntroAnimation;