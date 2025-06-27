import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

// Import modular game components
import GameArea from './components/GameArea';
import Controls from './components/Controls';
import ScoreStatus from './components/ScoreStatus';

/**
 * PUBLIC_INTERFACE
 * Main App component of the car game.
 * Renders the high-level layout: header, controls, score bar, and main responsive game area.
 * Implements game loop, movement, collision logic, and state management.
 */
function App() {
  // App theme (light/dark)
  const [theme, setTheme] = useState('light');

  // Game state: "Ready" | "Running" | "Paused" | "Game Over"
  const [gameStatus, setGameStatus] = useState('Ready');
  const [score, setScore] = useState(0);
  const [carPosition, setCarPosition] = useState(148); // X only, left edge
  const [obstacles, setObstacles] = useState([]);
  // Holds most recent score for display on Game Over
  const [lastScore, setLastScore] = useState(0);

  // --- Constants ---
  const areaWidth = 340;
  const areaHeight = 544;
  const carWidth = 44;
  const carHeight = 68;
  const obstacleMinWidth = 28;
  const obstacleMaxWidth = 44;
  const obstacleHeight = 36;
  const obstacleMinSpeed = 2.5;
  const obstacleMaxSpeed = 5.5;

  // Refs for main game loop & deterministic state
  const requestRef = useRef();
  const prevTimestampRef = useRef();
  const keysDownRef = useRef({});
  const gameRunningRef = useRef(false);

  // Responsive mobile touch gesture state
  const touchStartXRef = useRef(null);

  // --- Utils ---
  // Generate a random obstacle (returns an object)
  function generateObstacle(obstacleId) {
    const width = Math.floor(Math.random() * (obstacleMaxWidth - obstacleMinWidth + 1)) + obstacleMinWidth;
    const x = Math.floor(Math.random() * (areaWidth - width));
    const speed = Math.random() * (obstacleMaxSpeed - obstacleMinSpeed) + obstacleMinSpeed;
    return {
      id: obstacleId,
      x,
      y: -obstacleHeight,
      width,
      height: obstacleHeight,
      speed,
    };
  }

  // --- Game Logic ---

  // Move car, called from handleCarMove
  // PUBLIC_INTERFACE
  const handleCarMove = useCallback(
    (delta) => {
      setCarPosition((pos) =>
        Math.max(0, Math.min(pos + delta, areaWidth - carWidth))
      );
    },
    [areaWidth, carWidth]
  );

  // Listen to keyboard events for car movement (Left/Right arrows, A/D)
  useEffect(() => {
    function handleKeyDown(e) {
      if (gameStatus !== 'Running') return;
      keysDownRef.current[e.key] = true;
    }
    function handleKeyUp(e) {
      keysDownRef.current[e.key] = false;
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStatus]);

  // Touch events for mobile horizontal sliding
  useEffect(() => {
    function onTouchStart(e) {
      if (e.touches.length === 1 && gameStatus === 'Running') {
        touchStartXRef.current = e.touches[0].clientX;
      }
    }
    function onTouchMove(e) {
      if (e.touches.length === 1 && gameStatus === 'Running' && touchStartXRef.current !== null) {
        const deltaX = e.touches[0].clientX - touchStartXRef.current;
        if (Math.abs(deltaX) > 16) { // threshold
          handleCarMove(deltaX > 0 ? 24 : -24);
          touchStartXRef.current = e.touches[0].clientX; // update for continuous gestures
        }
      }
    }
    function onTouchEnd() {
      touchStartXRef.current = null;
    }
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [gameStatus, handleCarMove]);

  // --- Main Game Loop (animation frame) ---
  useEffect(() => {
    if (gameStatus === 'Running') {
      gameRunningRef.current = true;
      prevTimestampRef.current = undefined;
      requestRef.current = requestAnimationFrame(gameLoop);
    } else {
      gameRunningRef.current = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line
  }, [gameStatus, carPosition, obstacles]);

  // Main Game Loop body
  const obstacleIdRef = useRef(0); // persistent unique obstacle id

  const gameLoop = useCallback((timestamp) => {
    if (!gameRunningRef.current || gameStatus !== 'Running') return;

    // --- Handle car held key movement (smooth) ---
    if (keysDownRef.current['ArrowLeft'] || keysDownRef.current['a'] || keysDownRef.current['A']) {
      setCarPosition((prev) => Math.max(0, prev - 6));
    }
    if (keysDownRef.current['ArrowRight'] || keysDownRef.current['d'] || keysDownRef.current['D']) {
      setCarPosition((prev) => Math.min(areaWidth - carWidth, prev + 6));
    }

    // Time-based progression for obstacle movement & spawn
    const prev = prevTimestampRef.current ?? timestamp;
    const dt = Math.min(48, timestamp - prev); // ms since last frame, max 48ms (slowdown cap)
    prevTimestampRef.current = timestamp;

    // Move obstacles
    setObstacles((oldObstacles) => {
      // Move all by their speed
      let nextObs = oldObstacles
        .map((o) => ({ ...o, y: o.y + o.speed * (dt / 16) })); // normalize to 60fps
      // Cull if off bottom
      nextObs = nextObs.filter((o) => o.y < areaHeight);

      // Potentially spawn a new obstacle (every ~800-1350ms, but random)
      if (
        nextObs.length === 0 ||
        (nextObs[nextObs.length - 1].y > Math.random() * 120 + 90 && nextObs.length < 5)
      ) {
        obstacleIdRef.current += 1;
        nextObs.push(generateObstacle(obstacleIdRef.current));
      }
      return nextObs;
    });

    // Collision detection — after obstacles update
    setObstacles((currentObs) => {
      let gameOver = false;
      currentObs.forEach((obs) => {
        if (
          // axis-aligned bounding box
          obs.x < carPosition + carWidth &&
          obs.x + obs.width > carPosition &&
          obs.y < areaHeight - carHeight - 8 + carHeight &&
          obs.y + obs.height > areaHeight - carHeight - 8
        ) {
          gameOver = true;
        }
      });
      if (gameOver) {
        setGameStatus('Game Over');
        setLastScore(score);
        gameRunningRef.current = false;
        return [];
      }

      // If passed car, increase score for each
      currentObs.forEach((obs) => {
        if (!obs.scored && obs.y > areaHeight - carHeight - 6) {
          setScore((s) => s + 1);
          obs.scored = true;
        }
      });
      return currentObs;
    });

    // Continue loop
    if (gameRunningRef.current && gameStatus === 'Running') {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  // eslint-disable-next-line
  }, [carPosition, score, gameStatus]);

  // --- Handle theme switching
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // --- Controls (Start, Pause, Reset) ---
  // PUBLIC_INTERFACE
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  // PUBLIC_INTERFACE
  const handleStart = useCallback(() => {
    if (gameStatus === 'Running') return;
    setGameStatus('Running');
    setObstacles([]); // clear obs on new start (optional)
    setScore(0);
    prevTimestampRef.current = undefined;
    requestRef.current = requestAnimationFrame(gameLoop);
  // eslint-disable-next-line
  }, [gameStatus, gameLoop]);

  // PUBLIC_INTERFACE
  const handlePause = useCallback(() => {
    if (gameStatus === 'Running') setGameStatus('Paused');
  }, [gameStatus]);

  // PUBLIC_INTERFACE
  const handleReset = useCallback(() => {
    setGameStatus('Ready');
    setScore(0);
    setCarPosition(areaWidth/2 - carWidth/2);
    setObstacles([]);
    setLastScore(0);
    obstacleIdRef.current = 0;
    keysDownRef.current = {};
    prevTimestampRef.current = undefined;
    gameRunningRef.current = false;
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  }, []);

  // Focus game area for keyboard on mount
  const mainRef = useRef(null);
  useEffect(() => {
    if (mainRef.current) mainRef.current.focus();
  }, []);

  // Show final score on Game Over state
  const statusScore = gameStatus === 'Game Over' ? lastScore : score;

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
      <main className="main-content" ref={mainRef} tabIndex={0}>
        <ScoreStatus score={statusScore} status={gameStatus} />
        <GameArea
          carPosition={carPosition}
          areaWidth={areaWidth}
          areaHeight={areaHeight}
          obstacles={obstacles}
          onCarMove={handleCarMove}
        />
        {gameStatus === 'Game Over' && (
          <div style={{
            position: 'absolute', left: '50%', top: '59%', width: '330px', transform: 'translate(-50%,0)',
            background: 'rgba(255,255,255,0.95)', color: '#d00', border: '2px solid #c70000',
            borderRadius: 15, textAlign: 'center', fontSize: '1.5rem', fontWeight: 600,
            padding: 18, pointerEvents: 'none', zIndex: 100,
            boxShadow: '0 6px 40px 0 rgba(200,0,0,0.06)'
          }}>
            <div>🚩 <span style={{color:'#d00',fontWeight:800}}>Game Over!</span></div>
            <div style={{color:'#016fe4',marginTop:'9px',fontSize:'1.06em'}}>Score: {lastScore}</div>
            <div style={{fontSize:'0.92em',color:'#343A40',marginTop:'7px'}}>Press <span style={{ color:'#E87A41', fontWeight:600 }}>Reset</span> to play again</div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
