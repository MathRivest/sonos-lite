import { IPCRendererEvent } from '../common/types';
const { ipcRenderer } = window.require('electron');

export function sendMainMessage(data: IPCRendererEvent): void {
  console.log(`%c Sending ${data.type}`, 'background: #333; color: #fff', data.payload);
  ipcRenderer.send('App:message', data);
}

interface StoredData {
  activeDeviceId: string;
}

type StoredDataKeys = keyof StoredData;

export function setLocalStorage<Key extends StoredDataKeys>(
  key: Key,
  value: StoredData[Key],
): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalStorage<Key extends StoredDataKeys>(key: Key): StoredData[Key] | null {
  const value = localStorage.getItem(key as string);
  return value ? JSON.parse(value) : null;
}

export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m > 9 ? m : h ? `'0${m}` : `${m}` || `0`, s > 9 ? `${s}` : `0${s}`]
    .filter(a => a)
    .join(':');
};
