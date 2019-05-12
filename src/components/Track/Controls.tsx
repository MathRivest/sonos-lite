import React, { PureComponent } from 'react';
import Styles from './Controls.module.css';
import { SonosPlayState } from '../../../common/types';

interface IControlsProps {
  playState: SonosPlayState;
  onPlay: () => void;
  onPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export class Controls extends PureComponent<IControlsProps> {
  render() {
    const { playState, onPlay, onPause, onPrevious, onNext } = this.props;
    const isPlaying = playState === 'playing';
    const isTransitionning = playState === 'transitionning';
    return (
      <div className={Styles.Controls}>
        {isPlaying && <button onClick={onPause}>Pause</button>}
        {!isPlaying && <button onClick={onPlay}>Play</button>}
        <button onClick={onPrevious}>Previous</button>
        <button onClick={onNext}>Next</button>
      </div>
    );
  }
}

export default Controls;
