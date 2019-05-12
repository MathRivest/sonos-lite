import React, { Component } from 'react';
import Styles from './App.module.css';
import ElectronDragBar from './components/ElectronDragBar';
import {
  SonosDevice,
  IPCMainEvent,
  IPCEventPayloadSonosReady,
  SonosZoneGroup,
} from '../common/types';
import { sendMainMessage, setLocalStorage, getLocalStorage } from './helpers';
import { IpcMessageEvent } from 'electron';
import Rooms from './components/Rooms';
import Room from './components/Room';

const { ipcRenderer } = window.require('electron');

interface IAppState {
  devices: SonosDevice[];
  zoneGroups: SonosZoneGroup[];
  activeDevice: SonosDevice | undefined;
  isLoading: boolean;
}

class App extends Component<{}, IAppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      devices: [],
      zoneGroups: [],
      activeDevice: undefined,
      isLoading: true,
    };
  }

  componentDidMount() {
    sendMainMessage({ type: 'App:loaded' });
    ipcRenderer.on('Main:message', this.ipcRendererListener);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('Main:message', this.ipcRendererListener);
  }

  ipcRendererListener = (_event: IpcMessageEvent, data: IPCMainEvent) => {
    switch (data.type) {
      case 'SonosNetwork:ready':
        console.log(`%c Received ${data.type}`, 'background: #333; color: #fff', data.payload);
        this.handleSonosNetworkReady(data);
        break;
      default:
        break;
    }
  };

  handleSonosNetworkReady = (data: IPCEventPayloadSonosReady) => {
    const {
      payload: { devices },
    } = data;
    const storedActiveDeviceId = getLocalStorage('activeDeviceId');
    const device = devices.find(({ id }) => id === storedActiveDeviceId);
    const activeDevice = device ? device : devices[0];

    this.setState({
      devices: data.payload.devices,
      zoneGroups: data.payload.zoneGroups,
      activeDevice,
      isLoading: false,
    });
  };

  handleRoomChange = (deviceId: string) => {
    this.setState(
      state => {
        const activeDevice = state.devices.find(device => device.id === deviceId);
        return {
          activeDevice,
        };
      },
      () => {
        if (this.state.activeDevice) {
          setLocalStorage('activeDeviceId', this.state.activeDevice.id);
        }
        sendMainMessage({ type: 'Room:changed' });
      },
    );
  };

  renderEmptyState() {
    return <div>No devices found</div>;
  }

  renderLoadingState() {
    return <div>Discovering your Sonos devices...</div>;
  }

  renderReadyState() {
    const { zoneGroups, activeDevice } = this.state;
    return (
      <div>
        <Rooms
          zoneGroups={zoneGroups}
          activeDevice={activeDevice}
          onDeviceChanged={this.handleRoomChange}
        />
        <br />
        <br />
        {activeDevice && <Room device={activeDevice} key={activeDevice.id} />}
      </div>
    );
  }

  render() {
    const { devices, isLoading } = this.state;

    return (
      <div className={Styles.App}>
        <ElectronDragBar />
        {isLoading && this.renderLoadingState()}
        {!isLoading && devices.length === 0 && this.renderEmptyState()}
        {devices.length > 0 && this.renderReadyState()}
      </div>
    );
  }
}

export default App;
