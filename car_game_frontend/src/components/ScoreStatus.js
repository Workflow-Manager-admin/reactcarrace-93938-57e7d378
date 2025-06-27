import React from 'react';
import styles from './ScoreStatus.module.css';

/**
 * PUBLIC_INTERFACE
 * ScoreStatus component: Shows the score and current game status.
 * Props:
 * - score (number): Current score.
 * - status (string): Game status ('Ready', 'Running', etc).
 */
function ScoreStatus({ score, status }) {
  return (
    <section className={styles.scorebar}>
      <div className={styles['scorebar-section']}>
        <span className={styles['score-label']}>Score:</span>
        <span className={styles['score-value']}>{score}</span>
      </div>
      <div className={styles['scorebar-section']}>
        <span className={`${styles.status} ${styles[`status-${status.toLowerCase().replace(/\s/g, '')}`]}`}>{status}</span>
      </div>
    </section>
  );
}

ScoreStatus.defaultProps = {
  score: 0,
  status: 'Ready',
};

export default ScoreStatus;
