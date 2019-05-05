import React, { FC } from 'react';
import { SonosDevice } from '../../common/types';

interface IRoomsProps {
  devices: SonosDevice[];
  activeDevice: SonosDevice | undefined;
  onDeviceChanged: (deviceId: string) => void;
}
const Rooms: FC<IRoomsProps> = ({ devices, activeDevice, onDeviceChanged }) => {
  return (
    <select
      onChange={event => onDeviceChanged(event.target.value)}
      defaultValue={activeDevice ? activeDevice.id : devices[0].id}
    >
      {devices.map(({ displayName, name, id }) => {
        return (
          <option key={id} value={id}>
            {name} - {displayName}
          </option>
        );
      })}
    </select>
  );
};

export default Rooms;
