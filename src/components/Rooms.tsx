import React, { FC } from 'react';
import { SonosDevice } from '../../common/types';

interface IRoomsProps {
  devices: SonosDevice[];
  activeDevice: SonosDevice | undefined;
  setActiveDevice: (deviceId: string) => void;
}
const Rooms: FC<IRoomsProps> = ({ devices, activeDevice, setActiveDevice }) => {
  return (
    <select onChange={event => setActiveDevice(event.target.value)}>
      {devices.map(({ displayName, name, id }) => {
        return (
          <option key={id} value={id} selected={activeDevice ? activeDevice.id === id : false}>
            {name} - {displayName}
          </option>
        );
      })}
    </select>
  );
};

export default Rooms;
