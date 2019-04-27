import React, { FC } from 'react';
import Styles from './Player.module.css';

const Player: FC = () => {
  return (
    <div className={Styles.Player}>
      <button>Play</button>
      <button>Pause</button>
      <button>Previous</button>
      <button>Next</button>
    </div>
  );
};

export default Player;
