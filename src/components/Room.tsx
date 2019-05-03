import React, { Component } from 'react';
import { SonosDevice, SonosTrack, IPCMainEvent } from '../../common/types';
import { sendMainMessage } from '../helpers';
import { IpcMessageEvent } from 'electron';
import Player from './Player/Player';
import Styles from './Room.module.css';

const { ipcRenderer } = window.require('electron');

interface IRoomProps {
  device: SonosDevice;
  key: string;
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

    ipcRenderer.on('Main:message', this.ipcRendererListener);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('Main:message', this.ipcRendererListener);
  }

  ipcRendererListener = (_event: IpcMessageEvent, data: IPCMainEvent) => {
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

  handlePlayerOnPlay = () => {
    const { device } = this.props;
    sendMainMessage({
      type: 'Player:command',
      payload: {
        command: 'play',
        deviceId: device.id,
      },
    });
  };

  handlePlayerOnPause = () => {
    const { device } = this.props;
    sendMainMessage({
      type: 'Player:command',
      payload: {
        command: 'pause',
        deviceId: device.id,
      },
    });
  };

  handlePlayerOnPrevious = () => {
    const { device } = this.props;
    sendMainMessage({
      type: 'Player:command',
      payload: {
        command: 'previous',
        deviceId: device.id,
      },
    });
  };

  handlePlayerOnNext = () => {
    const { device } = this.props;
    sendMainMessage({
      type: 'Player:command',
      payload: {
        command: 'next',
        deviceId: device.id,
      },
    });
  };

  renderPlayer = () => {
    const playerProps = {
      onPlay: this.handlePlayerOnPlay,
      onPause: this.handlePlayerOnPause,
      onPrevious: this.handlePlayerOnPrevious,
      onNext: this.handlePlayerOnNext,
    };
    return <Player {...playerProps} />;
  };

  renderTrack() {
    const { track } = this.state;
    if (!track) {
      return 'Nothing Playing';
    }

    return (
      <div className={Styles.Room}>
        {this.renderPlayer()}
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
