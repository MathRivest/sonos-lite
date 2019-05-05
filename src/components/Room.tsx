import React, { Component } from 'react';
import { IPCMainEvent, SonosDevice, SonosTrack, SonosPlayState } from '../../common/types';
import { sendMainMessage } from '../helpers';
import { IpcMessageEvent } from 'electron';
import Styles from './Room.module.css';
import Player from './Player/Player';
import Track from './Track';

const { ipcRenderer } = window.require('electron');

interface IRoomProps {
  key: string;
  device: SonosDevice;
}

interface IRoomState {
  track: SonosTrack | null;
  playState: SonosPlayState | null;
}

class Room extends Component<IRoomProps, IRoomState> {
  constructor(props: IRoomProps) {
    super(props);

    this.state = {
      track: null,
      playState: null,
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
    switch (data.type) {
      case 'SonosNetwork:currentTrack':
        console.log(`%c Received ${data.type}`, 'background: #333; color: #fff', data.payload);
        this.setState({ track: data.payload.track });
        break;
      case 'SonosNetwork:currentPartialTrack':
        console.log(`%c Received ${data.type}`, 'background: #333; color: #fff', data.payload);
        this.setState(state => {
          if (state.track && data.payload.track.position) {
            return {
              ...this.state,
              track: {
                ...state.track,
                position: data.payload.track.position,
              },
            };
          } else {
            return this.state;
          }
        });
        break;
      case 'SonosNetwork:playState':
        console.log(`%c Received ${data.type}`, 'background: #333; color: #fff', data.payload);
        this.setState({ playState: data.payload.playState });
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

  handlePlayerGetPosition = () => {
    const { device } = this.props;
    sendMainMessage({
      type: 'Player:getPosition',
      payload: {
        deviceId: device.id,
      },
    });
  };

  renderPlayer = () => {};

  renderTrack() {
    const { track } = this.state;

    if (!track) {
      return (
        <div>
          <br />
          Nothing Playing
        </div>
      );
    }

    return (
      <div className={Styles.Room}>
        <Player
          onPlay={this.handlePlayerOnPlay}
          onPause={this.handlePlayerOnPause}
          onPrevious={this.handlePlayerOnPrevious}
          onNext={this.handlePlayerOnNext}
          onGetPosition={this.handlePlayerGetPosition}
        />
        <Track track={track} />
      </div>
    );
  }

  render() {
    const { device } = this.props;
    const { playState } = this.state;
    return (
      <>
        <div>{`Now Playing - ${device.name}`}</div>
        <div>{device.displayName}</div>
        <div>PlayState: {playState}</div>
        <div>{this.renderTrack()}</div>
      </>
    );
  }
}

export default Room;
