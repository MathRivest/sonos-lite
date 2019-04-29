import { app, BrowserWindow, Tray, ipcMain, IpcMessageEvent } from 'electron';
import { initMainWindow } from './main';
import { initTray } from './tray';

import SonosNetwork from './sonos';
import { sendRendererMessage } from './helpers';
import { IPCEventPayloadRoomLoaded, SonosTrack, IPCRendererEvent } from '../common/types';
import { async } from 'q';

let mainWindow: BrowserWindow;
let tray: Tray;
let sonosNetwork: SonosNetwork;

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
ipcMain.on('App:loaded', ipcMainListener);
ipcMain.on('Room:loaded', ipcMainListener);

async function ipcMainListener(_event: IpcMessageEvent, data: IPCRendererEvent): Promise<void> {
  console.log(`Received ${data.type}, ${data.payload}`);
  switch (data.type) {
    case 'App:loaded':
      handleAppLoaded();
      break;
    case 'Room:loaded':
      handleRoomLoaded(data);
      break;
  }
}

async function handleAppLoaded(): Promise<void> {
  if (sonosNetwork && sonosNetwork.isReady) {
    const devices = await sonosNetwork.getDevices();
    sendRendererMessage(mainWindow, {
      type: 'SonosNetwork:ready',
      payload: {
        devices,
      },
    });
  }
}

async function handleRoomLoaded(data: IPCEventPayloadRoomLoaded): Promise<void> {
  let track: SonosTrack | null;
  try {
    track = await sonosNetwork.getDeviceTrack(data.payload.deviceId);
    track = track.duration === 0 ? null : track;
  } catch (error) {
    track = null;
  }

  sendRendererMessage(mainWindow, {
    type: 'SonosNetwork:currentTrack',
    payload: {
      track,
    },
  });
}
