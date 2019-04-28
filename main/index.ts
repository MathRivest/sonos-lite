import { app, BrowserWindow, Tray, ipcMain, IpcMessageEvent } from 'electron';
import { initMainWindow } from './main';
import { initTray } from './tray';

import SonosNetwork from './sonos';

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

  console.log(`Discovered ${devices.length} devices`);

  mainWindow.webContents.send('SonosNetwork:ready', devices);
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

// In main process.
ipcMain.on('App:loaded', async (event: any, arg: any) => {
  console.log('TESTING!', arg);
  console.log(sonosNetwork.isReady);
  if (sonosNetwork && sonosNetwork.isReady) {
    const devices = await sonosNetwork.getDevices();
    mainWindow.webContents.send('SonosNetwork:ready', { devices });
  }
});
