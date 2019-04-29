import { IPCMainEvent } from '../common/types';
import { BrowserWindow } from 'electron';

export function sendRendererMessage(window: BrowserWindow, data: IPCMainEvent): void {
  console.log(`Sending ${data.type} ${data.payload}`);
  window.webContents.send(data.type, data);
}
