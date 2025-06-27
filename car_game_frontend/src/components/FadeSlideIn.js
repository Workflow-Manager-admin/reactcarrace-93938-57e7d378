import React, { useRef, useEffect, useState } from 'react';
import styles from './FadeSlideIn.module.css';

/**
 * PUBLIC_INTERFACE
 * FadeSlideIn: Animates children in/out with fade and slide for state transitions.
 * Props:
 *  - show (bool): Whether to show (fade/slide-in) or hide (fade/slide-out)
 *  - duration (ms): Optional animation duration (default: 350ms)
 *  - slideY (number): Number of px to slide from/to vertically (default: 24)
 */
function FadeSlideIn({ show, duration = 350, slideY = 24, children, className = '', style = {}, ...rest }) {
  const [rendered, setRendered] = useState(show);
  const timerRef = useRef();

  useEffect(() => {
    if (show) {
      setRendered(true);
    } else {
      timerRef.current = setTimeout(() => setRendered(false), duration);
    }
    return () => clearTimeout(timerRef.current);
  }, [show, duration]);

  if (!rendered && !show) return null;

  return (
    <div
      className={
        `${styles.fadeSlide} ${show ? styles.in : styles.out} ${className}`
      }
      style={{
        '--fade-duration': `${duration}ms`,
        '--slide-y': `${slideY}px`,
        ...style
      }}
      aria-live="assertive"
      {...rest}
    >
      {children}
    </div>
  );
}

export default FadeSlideIn;
