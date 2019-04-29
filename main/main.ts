import { BrowserWindow } from 'electron';
const path = require('path');
const os = require('os');

export function initMainWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: 220,
    height: 380,
    resizable: false,
    alwaysOnTop: true,
    title: 'SonosLite',
    backgroundColor: '#000000',
    darkTheme: true,
    frame: false,
    // show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  BrowserWindow.addDevToolsExtension(
    path.join(
      os.homedir(),
      '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/3.6.0_0',
    ),
  );

  return mainWindow;
}
