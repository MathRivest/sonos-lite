import React, { FC } from 'react';
import Styles from './Player.module.css';

interface IPlayerProps {
  onPlay: () => void;
  onPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const Player: FC<IPlayerProps> = ({ onPlay, onPause, onPrevious, onNext }) => {
  return (
    <div className={Styles.Player}>
      <button onClick={onPlay}>Play</button>
      <button onClick={onPause}>Pause</button>
      <button onClick={onPrevious}>Previous</button>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default Player;
