import React from 'react';
import { SonosDevice } from '../../common/types';

interface ISonosContextValues {
  devices: SonosDevice[];
}

const defaultContext: ISonosContextValues = {
  devices: [],
};

const SonosContext = React.createContext(defaultContext);

export default SonosContext;
