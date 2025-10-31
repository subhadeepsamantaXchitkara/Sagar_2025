import React, { useState, useRef, useEffect } from 'react';
import Confetti from 'react-confetti';
import './BP.css';
import { useCannon } from './useCannon'; // --- IMPORT THE CANNON HOOK ---

// --- Import your assets ---
import celebrationSong from './assets/audio/celebration-song.mp3';
import image1 from './assets/img/image1.jpeg';
import image2 from './assets/img/image2.jpeg';
import image3 from './assets/img/image3.jpeg';
import song1 from './assets/audio/song1.mp3';
import song2 from './assets/audio/song2.mp3';
import song3 from './assets/audio/song3.mp3';
import song4 from './assets/audio/song4.mp3';
import song5 from './assets/audio/song5.mp3';

// --- Playlist Data Structure ---
const playlist = [
  { id: 1, title: "Neele Neele Ambar Par", artist: "Kishore Kumar", src: song1 },
  { id: 2, title: "Tum Saath Ho Jab Apne", artist: "Kishore Kumar", src: song2 },
  { id: 3, title: "Ek Ajnabee Haseena Se", artist: "Kishore Kumar", src: song3 },
  { id: 4, title: "Chhookar Mere Mann Ko", artist: "Kishore Kumar", src: song4 },
  { id: 5, title: "Aaj Kal Tere Mere Pyar Ke Charche", artist: "Kishore Kumar", src: song5 },
];

function BirthdayPage() {
  // --- STATE MANAGEMENT ---
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isCelebrateSongPlaying, setIsCelebrateSongPlaying] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: document.body.scrollHeight,
  });

  const celebrateAudioRef = useRef(null);
  const playlistAudioRef = useRef(null);

  // --- NEW: Set up the cannon for the confetti explosion ---
  const [cannonProps, fire] = useCannon();


  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: document.body.scrollHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (playlistAudioRef.current) {
      if (isPlaying) {
        playlistAudioRef.current.play().catch(e => console.error("Play error:", e));
      } else {
        playlistAudioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  const handleFirstInteraction = () => {
    if (!hasInteracted) {
        celebrateAudioRef.current.play().then(() => celebrateAudioRef.current.pause());
        playlistAudioRef.current.play().then(() => playlistAudioRef.current.pause());
        setHasInteracted(true);
    }
  };

  const handleCelebrateClick = () => {
    // --- NEW: Fire the confetti cannon on every click ---
    fire();

    if (isPlaying) {
      playlistAudioRef.current.pause();
      setIsPlaying(false);
    }
    if (!hasInteracted) {
      playlistAudioRef.current.play().then(() => playlistAudioRef.current.pause());
      if (celebrateAudioRef.current) {
        celebrateAudioRef.current.play();
      }
      setHasInteracted(true);
      setIsCelebrating(true);
      setIsCelebrateSongPlaying(true);
    } else {
      if (isCelebrateSongPlaying) {
        celebrateAudioRef.current.pause();
      } else {
        celebrateAudioRef.current.play();
      }
      setIsCelebrateSongPlaying(!isCelebrateSongPlaying);
      if (!isCelebrating) {
        setIsCelebrating(true);
      }
    }
  };

  const handleSongSelect = (song) => {
    handleFirstInteraction();
    setCurrentSong(song);
    if (celebrateAudioRef.current) {
        celebrateAudioRef.current.pause();
        setIsCelebrateSongPlaying(false);
    }
    if (playlistAudioRef.current) {
      playlistAudioRef.current.src = song.src;
      playlistAudioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => console.error("Play error:", e));
    }
  };

  const handlePlayPause = () => {
    if (currentSong) {
      if (!isPlaying) {
        if (celebrateAudioRef.current) {
          celebrateAudioRef.current.pause();
          setIsCelebrateSongPlaying(false);
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="birthday-container">
      {/* --- MODIFIED: Update the Confetti component for the explosion --- */}
      {isCelebrating && (
        <Confetti
          {...cannonProps} // Use props from the cannon
          width={windowSize.width}
          height={windowSize.height}
          recycle={false} // Make it a one-time blast
          numberOfPieces={500} // More pieces for a bigger blast
          gravity={0.15}
          initialVelocityY={-20}
          initialVelocityX={{ min: -15, max: 15 }}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
        />
      )}

      <audio ref={celebrateAudioRef} src={celebrationSong} />
      <audio ref={playlistAudioRef} />

      <section className="welcome-section">
        <h1 className="main-title">A Special Day for a Special Friend</h1>
        <p className="subtitle">This page is dedicated to celebrating you!</p>
      </section>

      <section className="message-section">
        <h2>A Message from Me to You</h2>
        <div className="message-content">
          <p>
           🎉 Happy Birthday, Sagar! 💻🎂

No matter where life takes us, some friendships always stay close to the heart — just like ours. ❤️
You’ve always been more than a friend — a true partner in all things tech, laughter, and all the things . I really miss those moments, but I’m always proud to call you my friend. 🙌 </p>
          <p>
           Keep chasing your dreams, keep growing, and keep shining like the genius you are. 🌟
Wishing you endless happiness, success, and good vibes ahead.

Happy Birthday once again, brother! 💫 </p>
        </div>
      </section>

      <div className="celebrate-button-container">
        {/* --- MODIFIED: Connect the button to the cannon ref --- */}
        <button
          ref={cannonProps.ref}
          onClick={handleCelebrateClick}
          className={`celebrate-button ${isCelebrating ? 'celebrated' : ''}`}
        >
          {isCelebrating
            ? (isCelebrateSongPlaying ? '❚❚ Pause Celebration' : '▶ Play Celebration')
            : '🎉 Click to Celebrate 🎉'
          }
        </button>
      </div>
      
      <section className="fixed-images-section">
        <img src={image2} alt="Memory 1" className="fixed-image" />
        <img src={image3} alt="Memory 2" className="fixed-image" />
        <img src={image1} alt="Memory 3" className="fixed-image" />
      </section>

      <section className="music-section">
        <h2>A Playlist for You</h2>
        <div className="player-container">
            <div className="player-controls">
                <p className="now-playing">
                    {currentSong ? `${currentSong.title} - ${currentSong.artist}` : 'Select a song below'}
                </p>
                <button onClick={handlePlayPause} className="play-pause-btn" disabled={!currentSong}>
                    {isPlaying ? '❚❚' : '▶'}
                </button>
            </div>
            <ul className="song-list">
            {playlist.map((song) => (
                <li
                key={song.id}
                className={`song-item ${currentSong && currentSong.id === song.id ? 'active' : ''}`}
                onClick={() => handleSongSelect(song)}
                >
                <span className="song-title">{song.title}</span>
                <span className="song-artist">{song.artist}</span>
                </li>
            ))}
            </ul>
        </div>
      </section>
    </div>
  );
}

export default BirthdayPage;