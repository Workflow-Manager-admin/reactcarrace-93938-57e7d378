import React from 'react';
import styles from './Car.module.css';

/**
 * PUBLIC_INTERFACE
 * Car component: Renders the player's car in the game area.
 * Props:
 * - x (number): Horizontal position (px, from left).
 * - gameWidth (number): Game area width (for boundary constraints).
 * - gameHeight (number): Game area height (for vertical alignment).
 */
function Car({ x, gameWidth, gameHeight }) {
  // Car size
  const width = 44, height = 68;
  // Center car vertically at the bottom
  const left = Math.max(0, Math.min(x, gameWidth - width));
  const top = gameHeight - height - 8;

  return (
    <div
      className={styles.car}
      style={{
        left,
        top,
        width,
        height,
      }}
      aria-label="Player's car"
    />
  );
}

Car.defaultProps = {
  x: 148,
  gameWidth: 340,
  gameHeight: 544,
};

export default Car;
