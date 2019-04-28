import { BrowserWindow } from 'electron';

export function initMainWindow(): BrowserWindow {
  return new BrowserWindow({
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
}
