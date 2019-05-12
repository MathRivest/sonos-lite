import { app, BrowserWindow, Tray, ipcMain, IpcMessageEvent } from 'electron';
import { initMainWindow } from './main';
import { initTray } from './tray';

import { sendRendererMessage } from './helpers';
import {
  IPCRendererEvent,
  IPCEventPayloadRoomLoaded,
  IPCEventPayloadPlayerCommand,
  SonosTrack,
  SonosDevice,
  SonosPlayState,
} from '../common/types';

import SonosNetwork from './sonos/sonosNetwork';
import SonosPlayer from './sonos/sonosPlayer';

let mainWindow: BrowserWindow;
let tray: Tray;
let sonosNetwork: SonosNetwork;
let sonosPlayer: SonosPlayer;
let positionTimer: NodeJS.Timeout | null = null;

async function init() {
  mainWindow = initMainWindow();
  mainWindow.loadURL('http://localhost:3000');

  tray = initTray();
  tray.addListener('click', handleTrayClick);

  // Open the DevTools.
  mainWindow.webContents.openDevTools({
    mode: 'detach',
  });

  mainWindow.on('show', (): void => tray.setHighlightMode('always'));
  mainWindow.on('hide', (): void => tray.setHighlightMode('never'));
  mainWindow.on('closed', (): void => (mainWindow = null));

  sonosNetwork = new SonosNetwork();
  sonosPlayer = new SonosPlayer(sonosNetwork);

  const devices = await sonosNetwork.init();

  sendRendererMessage(mainWindow, {
    type: 'SonosNetwork:ready',
    payload: {
      devices,
    },
  });
}

app.on('ready', init);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) init();
});

function handleTrayClick() {
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    mainWindow.show();
  }
}

/**
 * ipcMain event listeners
 */
ipcMain.on('App:message', ipcMainListener);

async function ipcMainListener(_event: IpcMessageEvent, data: IPCRendererEvent): Promise<void> {
  console.log(`Received ${data.type}`, data.payload);
  switch (data.type) {
    case 'App:loaded':
      handleAppLoaded();
      break;
    case 'Room:loaded':
      handleRoomLoaded(data);
      break;
    case 'Room:changed':
      unsubscribeFromDevices();
      break;
    case 'Player:command':
      handlePlayerCommand(data);
      break;
  }
}

async function handleAppLoaded(): Promise<void> {
  if (sonosNetwork && sonosNetwork.isReady) {
    const devices = await sonosNetwork.getDevices();
    unsubscribeFromDevices();
    sendRendererMessage(mainWindow, {
      type: 'SonosNetwork:ready',
      payload: {
        devices,
      },
    });
  }
}

async function handleRoomLoaded(data: IPCEventPayloadRoomLoaded): Promise<void> {
  let device: SonosDevice = await sonosNetwork.getDevice(data.payload.deviceId);
  let track: SonosTrack | null = null;
  let playState: SonosPlayState;

  await sonosPlayer.setActiveDevice(device.id);
  try {
    track = await device.currentTrack();
    track = track.duration === 0 ? null : track;
    playState = await device.getCurrentState();
  } catch (error) {
    console.log('Error::Could not get track or playstate');
  }

  handleCurrentTrackEvent(track);
  handlePlayStateEvent(playState);
  startGetPositionTimer();

  device.on('CurrentTrack', handleCurrentTrackEvent);
  device.on('PlayState', handlePlayStateEvent);
}

async function handleCurrentTrackEvent(track: SonosTrack) {
  const position = await sonosPlayer.getPosition();
  const payload = position
    ? {
        track: { ...track, position },
      }
    : {
        track,
      };
  sendRendererMessage(mainWindow, {
    type: 'SonosNetwork:currentTrack',
    payload,
  });
}

async function handlePlayStateEvent(playState: SonosPlayState) {
  sendRendererMessage(mainWindow, {
    type: 'SonosNetwork:playState',
    payload: {
      playState,
    },
  });
}

async function handlePlayerCommand(data: IPCEventPayloadPlayerCommand): Promise<void> {
  await sonosPlayer.sendCommand(data.payload.command);
}

function startGetPositionTimer(): void {
  positionTimer = setInterval(() => {
    handlePlayerGetPosition();
  }, 1000);
}

function clearGetPositionTimer(): void {
  clearInterval(positionTimer);
}

async function handlePlayerGetPosition(): Promise<void> {
  const position = await sonosPlayer.getPosition();
  if (position) {
    sendRendererMessage(mainWindow, {
      type: 'SonosNetwork:currentPartialTrack',
      payload: {
        track: {
          position,
        },
      },
    });
  }
}

function unsubscribeFromDevices(): void {
  clearGetPositionTimer();
  // Unsubscribe to all events when changing rooms
  const devices = sonosNetwork.getDevices();
  devices.forEach(device => {
    device.removeListener('CurrentTrack', handleCurrentTrackEvent);
    device.removeListener('PlayState', handlePlayStateEvent);
  });
}
