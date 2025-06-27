import React from 'react';
import Car from './Car';
import Obstacle from './Obstacle';
import styles from './GameArea.module.css';

/**
 * PUBLIC_INTERFACE
 * GameArea component: Main playfield/canvas for the car game.
 * Renders the player's car and falling obstacles.
 * Props:
 * - carPosition (number): X-axis position of the car.
 * - obstacles (array): Array of obstacle objects {id, x, y}.
 * - onCarMove (function): Callback for car movement.
 * - areaWidth, areaHeight (number): Dimensions of the game area.
 */
function GameArea({ carPosition, areaWidth, areaHeight, obstacles, onCarMove }) {
  return (
    <div
      className={styles.gameArea}
      style={{
        width: areaWidth,
        height: areaHeight,
        position: 'relative',
        overflow: 'hidden',
      }}
      tabIndex={0}
    >
      {/* Render the Car */}
      <Car x={carPosition} gameWidth={areaWidth} gameHeight={areaHeight} />

      {/* Render Obstacles */}
      {obstacles.map((obs) => (
        <Obstacle
          key={obs.id}
          x={obs.x}
          y={obs.y}
          width={obs.width}
          height={obs.height}
        />
      ))}
    </div>
  );
}

GameArea.defaultProps = {
  obstacles: [],
  areaWidth: 340,
  areaHeight: 544,
};

export default GameArea;
