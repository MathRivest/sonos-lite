import { IPCRendererEvent } from '../common/types';
const { ipcRenderer } = window.require('electron');

export function sendMainMessage(data: IPCRendererEvent): void {
  console.log(`%c Sending ${data.type}`, 'background: #333; color: #fff', data.payload);
  ipcRenderer.send(data.type, data);
}
