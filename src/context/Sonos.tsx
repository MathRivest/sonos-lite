import React from 'react';
import { SonosDevice } from '../../common/types';

interface ISonosContextValues {
  devices: SonosDevice[];
  activeDevice: SonosDevice | undefined;
  setActiveDevice: (deviceId: string) => void;
}

const defaultContext: ISonosContextValues = {
  devices: [],
  activeDevice: undefined,
  setActiveDevice: (deviceId: string) => {},
};

const SonosContext = React.createContext(defaultContext);

export default SonosContext;
