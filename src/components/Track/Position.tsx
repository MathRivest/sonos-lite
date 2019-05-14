import React, { PureComponent } from 'react';
import Styles from './Position.module.css';
import { formatDuration } from '../../helpers';

interface IPositionProps {
  position?: number;
  duration: number;
  onSeek: (newPosition: number) => void;
  isUpdating?: boolean;
}
export class Position extends PureComponent<IPositionProps> {
  static defaultProps = {
    duration: 1,
  };

  shouldComponentUpdate = (nextProps: IPositionProps): boolean => {
    return !nextProps.isUpdating;
  };

  handlePositionClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const elDimensions = event.currentTarget.getBoundingClientRect();
    const x = event.pageX - elDimensions.left;
    const rawNewPositionPercent = (x / elDimensions.width) * 100;
    const roundedNewPositionPercent = Math.round(rawNewPositionPercent);
    this.props.onSeek(roundedNewPositionPercent);
  };

  render() {
    const { position, duration } = this.props;
    const progress = position ? Math.floor((position / duration) * 100) : 0;
    return (
      <div className={Styles.Position} onClick={this.handlePositionClick}>
        <div className={Styles.line}>
          <div className={Styles.progress} style={{ width: progress + '%' }} />
          <div className={Styles.cursor} style={{ left: progress + '%' }} />
        </div>
        <div className={Styles.info}>
          <div className={Styles.position}>{formatDuration(position ? position : 0)}</div>
          <div className={Styles.duration}>{formatDuration(duration)}</div>
        </div>
      </div>
    );
  }
}

export default Position;
