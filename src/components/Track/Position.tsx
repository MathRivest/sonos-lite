import React from 'react';
import Styles from './Position.module.css';

const Position: React.FC<{
  position?: number;
  duration?: number;
}> = ({ position, duration = 1 }) => {
  const progress = position ? Math.floor((position / duration) * 100) : 0;
  return (
    <div className={Styles.Position}>
      <div className={Styles.wrapper}>
        <div className={Styles.progress} style={{ width: progress + '%' }} />
        <div className={Styles.cursor} style={{ left: progress + '%' }} />
      </div>
      {`${position} / ${duration}`}
    </div>
  );
};

export default Position;
