import React, { FC } from 'react';
import Styles from './Player.module.css';
import SonosContext from '../../context/Sonos';

const Player: FC = () => {
  return (
    <SonosContext.Consumer>
      {context => (
        <div className={Styles.Player}>
          {context.devices.length > 0 ? context.devices[0].name : 'Loading devices...'}
          <br />
          <br />
          <button>Play</button>
          <button>Pause</button>
          <button>Previous</button>
          <button>Next</button>
        </div>
      )}
    </SonosContext.Consumer>
  );
};

export default Player;
