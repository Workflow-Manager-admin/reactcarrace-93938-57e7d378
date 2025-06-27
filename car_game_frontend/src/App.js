import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * Main App component of the car game.
 * Renders the high-level layout: header, controls, score bar, and main responsive game area.
 */
function App() {
  const [theme, setTheme] = useState('light');
  const [gameStatus, setGameStatus] = useState('Ready'); // 'Ready' | 'Running' | 'Paused' | 'Game Over'
  const [score, setScore] = useState(0);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // PUBLIC_INTERFACE
  const handleStart = () => {
    setGameStatus('Running');
    // Reset or start game logic goes here
  };

  // PUBLIC_INTERFACE
  const handlePause = () => {
    setGameStatus(status => (status === 'Running' ? 'Paused' : status));
    // Pause game logic goes here
  };

  // PUBLIC_INTERFACE
  const handleReset = () => {
    setGameStatus('Ready');
    setScore(0);
    // Reset game logic goes here
  };

  return (
    <div className="App">
      <header className="header">
        <div className="header-title">🚗 Car Game</div>
        <div className="header-controls">
          <button
            className="game-btn"
            onClick={handleStart}
            disabled={gameStatus === 'Running'}
            aria-label="Start Game"
          >
            Start
          </button>
          <button
            className="game-btn"
            onClick={handlePause}
            disabled={gameStatus !== 'Running'}
            aria-label="Pause Game"
          >
            Pause
          </button>
          <button
            className="game-btn"
            onClick={handleReset}
            aria-label="Reset Game"
          >
            Reset
          </button>
        </div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>
      <main className="main-content">
        <section className="scorebar">
          <div className="scorebar-section">
            <span className="score-label">Score:</span>
            <span className="score-value">{score}</span>
          </div>
          <div className="scorebar-section">
            <span className={`status status-${gameStatus.toLowerCase().replace(/\s/g, '')}`}>{gameStatus}</span>
          </div>
        </section>
        <section className="game-area">
          {/* Placeholder for future game canvas/board, cars, etc. */}
          <div className="game-placeholder">
            <span>Game Area</span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
