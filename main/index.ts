import { app, BrowserWindow, Tray } from 'electron';
import { initMainWindow } from './main';
import { initTray } from './tray';

let mainWindow: BrowserWindow;
let tray: Tray;

function init() {
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
