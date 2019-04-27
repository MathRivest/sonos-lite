import { Tray } from 'electron';
const trayIconPath = './public/sonos-tray@3x.png';

export function initTray(): Tray {
  const tray = new Tray(trayIconPath);
  return tray;
}
