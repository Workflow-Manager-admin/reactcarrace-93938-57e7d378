import React from 'react';
import styles from './Obstacle.module.css';

/**
 * PUBLIC_INTERFACE
 * Obstacle component: Renders a falling or moving obstacle.
 * Props:
 * - x (number): Horizontal position.
 * - y (number): Vertical position.
 * - width (number): Obstacle width.
 * - height (number): Obstacle height.
 */
function Obstacle({ x, y, width, height }) {
  return (
    <div
      className={styles.obstacle}
      style={{
        left: x,
        top: y,
        width,
        height,
      }}
      aria-label="Obstacle"
    />
  );
}

Obstacle.defaultProps = {
  width: 36,
  height: 36,
  x: 0,
  y: 0,
};

export default Obstacle;
