import React, { FC } from 'react';
import { SonosDevice, SonosZoneGroup } from '../../common/types';

interface IRoomsProps {
  zoneGroups: SonosZoneGroup[];
  activeDevice: SonosDevice | undefined;
  onDeviceChanged: (deviceId: string) => void;
}
const Rooms: FC<IRoomsProps> = ({ zoneGroups, activeDevice, onDeviceChanged }) => {
  return (
    <select
      onChange={event => onDeviceChanged(event.target.value)}
      defaultValue={activeDevice ? activeDevice.id : zoneGroups[0].coordinator.id}
    >
      {zoneGroups.map(({ name, coordinator }) => {
        return (
          <option key={coordinator.id} value={coordinator.id}>
            {name}
          </option>
        );
      })}
    </select>
  );
};

export default Rooms;
