import React, { Component } from 'react';
import Styles from './App.module.css';
import ElectronDragBar from './components/ElectronDragBar';
import Player from './components/Player/Player';
import SonosContext from './context/Sonos';
import { SonosDevice, IPCEventPayload } from '../common/types';
import { sendMainMessage } from './helpers';
import { IpcMessageEvent } from 'electron';
import Rooms from './components/Devices/Rooms';

const { ipcRenderer } = window.require('electron');

ipcRenderer.on('Main:received', (event: any, arg: any) => {
  console.log(arg);
});

interface IAppState {
  devices: SonosDevice[];
  activeDevice: SonosDevice | undefined;
  setActiveDevice: (deviceId: string) => void;
}

class App extends Component<{}, IAppState> {
  setActiveDevice: (deviceId: string) => void;
  constructor(props: {}) {
    super(props);

    this.setActiveDevice = (deviceId: string) => {
      this.setState(state => {
        const activeDevice = state.devices.find(device => device.id === deviceId);
        return {
          activeDevice,
        };
      });
    };

    this.state = {
      devices: [],
      activeDevice: undefined,
      setActiveDevice: this.setActiveDevice,
    };
  }

  componentDidMount() {
    sendMainMessage({ type: 'App:loaded' });
    ipcRenderer.on('SonosNetwork:ready', this.ipcRendererListener);
  }

  ipcRendererListener = (_event: IpcMessageEvent, data: IPCEventPayload) => {
    console.log(`%c Received ${data.type} ${data.payload}`, 'background: #333; color: #fff');
    switch (data.type) {
      case 'SonosNetwork:ready':
        const {
          payload: { devices },
        } = data;
        this.setState({ devices: data.payload.devices, activeDevice: devices[0] });
        break;
      default:
        break;
    }
  };

  render() {
    const { activeDevice } = this.state;

    return (
      <div className={Styles.App}>
        <SonosContext.Provider value={this.state}>
          <ElectronDragBar />
          <Player />
          <Rooms />
          <br />
          <br />
          <div>{activeDevice ? `Now Playing - ${activeDevice.name}` : 'No Device Selected'}</div>
          <br />
          <div>Up next:</div>
        </SonosContext.Provider>
      </div>
    );
  }
}

// const App: FC = () => {
// console.log(ipcRenderer);
// ipcRenderer.on('pong', (event: any, arg: any) => {
//   console.log('pong');
// });
// ipcRenderer.send('ping allo');
// };

export default App;
