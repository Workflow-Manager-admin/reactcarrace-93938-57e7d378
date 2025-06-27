import React from 'react';
import styles from './Controls.module.css';

/**
 * PUBLIC_INTERFACE
 * Controls component: Displays the Start, Pause, Reset game controls.
 * Props:
 * - onStart (func): Start game callback.
 * - onPause (func): Pause callback.
 * - onReset (func): Reset callback.
 * - gameStatus (string): Current game state.
 */
function Controls({ onStart, onPause, onReset, gameStatus }) {
  return (
    <div className={styles.controls}>
      <button
        className="game-btn"
        onClick={onStart}
        disabled={gameStatus === 'Running'}
        aria-label="Start Game"
      >
        Start
      </button>
      <button
        className="game-btn"
        onClick={onPause}
        disabled={gameStatus !== 'Running'}
        aria-label="Pause Game"
      >
        Pause
      </button>
      <button
        className="game-btn"
        onClick={onReset}
        aria-label="Reset Game"
      >
        Reset
      </button>
    </div>
  );
}

export default Controls;
