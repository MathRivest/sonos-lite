import React from 'react';
import { SonosTrack } from '../../common/types';

interface ITrackProps {
  track: SonosTrack;
}

const Track: React.FC<ITrackProps> = ({ track }) => {
  return (
    <div>
      <div>{track.title}</div>
      <div>
        {track.position ? track.position : 0}|{track.duration}
      </div>
      <div>
        {track.artist} - {track.album}
      </div>
    </div>
  );
};

export default Track;
