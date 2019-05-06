import React, { Component } from 'react';
import { IPCMainEvent, SonosDevice, SonosTrack, SonosPlayState } from '../../common/types';
import { sendMainMessage } from '../helpers';
import { IpcMessageEvent } from 'electron';
import Styles from './Room.module.css';
import Controls from './Track/Controls';
import TrackInfos from './Track/TrackInfos';
import AlbumArt from './Track/AlbumArt';
import Position from './Track/Position';

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
          if (state.track) {
            return {
              ...this.state,
              track: {
                ...state.track,
                ...data.payload.track,
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

  renderTrack() {}

  render() {
    const { track, playState } = this.state;

    if (!track || !playState) {
      return (
        <div>
          <br />
          Nothing Playing
        </div>
      );
    }

    return (
      <div className={Styles.Room}>
        <Position position={track.position} duration={track.duration} />
        <TrackInfos track={track} />
        <Controls
          playState={playState}
          onPlay={this.handlePlayerOnPlay}
          onPause={this.handlePlayerOnPause}
          onPrevious={this.handlePlayerOnPrevious}
          onNext={this.handlePlayerOnNext}
          onGetPosition={this.handlePlayerGetPosition}
        />
        <AlbumArt
          URI={track.albumArtURL ? track.albumArtURL : track.albumArtURI}
          name={track.album}
        />
      </div>
    );
  }
}

export default Room;
