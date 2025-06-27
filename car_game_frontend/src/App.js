import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// Import modular game components
import GameArea from './components/GameArea';
import Controls from './components/Controls';
import ScoreStatus from './components/ScoreStatus';

/**
 * PUBLIC_INTERFACE
 * Main App component of the car game.
 * Renders the high-level layout: header, controls, score bar, and main responsive game area.
 */
function App() {
  // App theme (light/dark)
  const [theme, setTheme] = useState('light');
  // Game state management
  const [gameStatus, setGameStatus] = useState('Ready'); // 'Ready' | 'Running' | 'Paused' | 'Game Over'
  const [score, setScore] = useState(0);

  // Placeholder states for demo/game scaffold
  const [carPosition, setCarPosition] = useState(148);
  const [obstacles, setObstacles] = useState([
    // Demo placeholder: a single obstacle for scaffolding
    { id: 1, x: 90, y: 50, width: 36, height: 36 }
  ]);

  // Game field dimensions (fits container)
  const areaWidth = 340;
  const areaHeight = 544;

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  // PUBLIC_INTERFACE
  const handleStart = useCallback(() => {
    setGameStatus('Running');
    // TODO: start main game loop
  }, []);

  // PUBLIC_INTERFACE
  const handlePause = useCallback(() => {
    setGameStatus((status) => (status === 'Running' ? 'Paused' : status));
    // TODO: pause main game loop
  }, []);

  // PUBLIC_INTERFACE
  const handleReset = useCallback(() => {
    setGameStatus('Ready');
    setScore(0);
    setCarPosition(148);
    // TODO: reset game state, clear obstacles, etc.
  }, []);

  // To be used for keyboard/touch support
  // PUBLIC_INTERFACE
  const handleCarMove = useCallback(
    (delta) => {
      setCarPosition((pos) =>
        Math.max(0, Math.min(pos + delta, areaWidth - 44))
      );
    },
    [areaWidth]
  );

  // TODO: add keyboard/touch listeners for handleCarMove

  return (
    <div className="App">
      <header className="header">
        <div className="header-title">🚗 Car Game</div>
        <Controls
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
          gameStatus={gameStatus}
        />
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>
      <main className="main-content">
        <ScoreStatus score={score} status={gameStatus} />
        <GameArea
          carPosition={carPosition}
          areaWidth={areaWidth}
          areaHeight={areaHeight}
          obstacles={obstacles}
          onCarMove={handleCarMove}
        />
      </main>
    </div>
  );
}

export default App;
