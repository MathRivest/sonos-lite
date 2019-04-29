import SonosContext from '../context/Sonos';
import React, { FC } from 'react';

const Rooms: FC = () => {
  return (
    <SonosContext.Consumer>
      {context => (
        <select onChange={event => context.setActiveDevice(event.target.value)}>
          {context.devices.map(({ displayName, name, id }) => {
            return (
              <option
                key={id}
                value={id}
                defaultValue={context.activeDevice ? context.activeDevice.id : ''}
              >
                {name} - {displayName}
              </option>
            );
          })}
        </select>
      )}
    </SonosContext.Consumer>
  );
};

export default Rooms;
