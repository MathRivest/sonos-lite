import React, { Component } from 'react';
import { SonosDevice, IPCEventPayload, SonosTrack } from '../../common/types';
import { sendMainMessage } from '../helpers';
import { IpcMessageEvent } from 'electron';

const { ipcRenderer } = window.require('electron');

interface IRoomProps {
  device: SonosDevice;
}

interface IRoomState {
  track: SonosTrack | null;
}

class Room extends Component<IRoomProps, IRoomState> {
  constructor(props: IRoomProps) {
    super(props);

    this.state = {
      track: null,
    };
  }

  componentDidMount() {
    sendMainMessage({
      type: 'Room:loaded',
      payload: {
        deviceId: this.props.device.id,
      },
    });

    ipcRenderer.on('SonosNetwork:currentTrack', this.ipcRendererListener);
  }

  ipcRendererListener = (_event: IpcMessageEvent, data: IPCEventPayload) => {
    console.log(`%c Received ${data.type}`, 'background: #333; color: #fff', data.payload);
    switch (data.type) {
      case 'SonosNetwork:currentTrack':
        const {
          payload: { track },
        } = data;
        this.setState({ track });
        break;
      default:
        break;
    }
  };

  renderTrack() {
    const { track } = this.state;
    if (!track) {
      return 'Nothing Playing';
    }

    return (
      <div>
        <div>{track.title}</div>
        <div>
          {track.position}|{track.duration}
        </div>
        <div>
          {track.artist} - {track.album}
        </div>
      </div>
    );
  }

  render() {
    const { device } = this.props;
    return (
      <>
        <div>{`Now Playing - ${device.name}`}</div>
        <div>{device.displayName}</div>
        <div>{this.renderTrack()}</div>
      </>
    );
  }
}

export default Room;
