import React, { Component } from 'react';
import Styles from './App.module.css';
import ElectronDragBar from './components/ElectronDragBar';
import Player from './components/Player/Player';
import SonosContext from './context/Sonos';
import { SonosDevice, IPCEventPayload } from '../common/types';
import { sendMainMessage } from './helpers';
import { IpcMessageEvent } from 'electron';

const { ipcRenderer } = window.require('electron');

ipcRenderer.on('Main:received', (event: any, arg: any) => {
  console.log(arg);
});

interface IAppState {
  devices: SonosDevice[];
}

class App extends Component<{}, IAppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      devices: [],
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
        this.setState({ devices: data.payload.devices });
        break;
      default:
        break;
    }
  };

  render() {
    const { devices } = this.state;

    return (
      <div className={Styles.App}>
        <SonosContext.Provider value={{ devices }}>
          <ElectronDragBar />
          <Player />

          <br />
          <div>Currently Playing:</div>
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
