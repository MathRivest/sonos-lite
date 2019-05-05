import React, { PureComponent } from 'react';
import Styles from './Player.module.css';

interface IPlayerProps {
  onPlay: () => void;
  onPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onGetPosition: () => void;
}

export class Player extends PureComponent<IPlayerProps> {
  positionTimer: NodeJS.Timeout | null = null;

  componentDidMount() {
    this.positionTimer = setInterval(() => this.props.onGetPosition(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.positionTimer!);
  }

  render() {
    const { onPlay, onPause, onPrevious, onNext } = this.props;
    return (
      <div className={Styles.Player}>
        <button onClick={onPlay}>Play</button>
        <button onClick={onPause}>Pause</button>
        <button onClick={onPrevious}>Previous</button>
        <button onClick={onNext}>Next</button>
      </div>
    );
  }
}

export default Player;
