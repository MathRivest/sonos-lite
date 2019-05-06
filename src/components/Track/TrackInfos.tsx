import React from 'react';
import { SonosTrack } from '../../../common/types';

const TrackInfos: React.FC<{
  track: SonosTrack;
}> = ({ track }) => {
  return (
    <div>
      <div>{track.title}</div>
      <div>
        {track.artist} - {track.album}
      </div>
    </div>
  );
};

export default TrackInfos;
