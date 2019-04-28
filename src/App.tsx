import React, { Component } from 'react';
import Styles from './App.module.css';
import ElectronDragBar from './components/ElectronDragBar';
import Player from './components/Player/Player';
import SonosContext from './context/Sonos';
import { SonosDevice } from '../common/types';

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
    ipcRenderer.send('App:loaded', 'testing');

    ipcRenderer.on('SonosNetwork:ready', (_event: any, payload: any) => {
      console.log('SonosNetwork is ready:', payload);
      this.setState({ devices: payload.devices });
    });
  }

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
