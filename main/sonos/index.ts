import { SonosDevice } from '../../common/types';

const { DeviceDiscovery, Listener } = require('sonos');

const DISCOVERY_TIMEOUT = 3000;

export default class SonosNetwork {
  devices: SonosDevice[] = [];
  zoneGroups: any[] = [];
  listener = Listener;
  isReady = false;

  constructor() {}

  public async init() {
    this.devices = [];
    await this.discover();
    this.isReady = true;
    console.log(`SonosNetwork::Discovered ${this.devices.length} devices`);
    return this.getDevices();
  }

  public async getDevices(): Promise<SonosDevice[]> {
    return this.devices;
  }

  private async discover(): Promise<SonosDevice[]> {
    return new Promise(resolve => {
      const sonosSearch = DeviceDiscovery({ timeout: DISCOVERY_TIMEOUT });

      sonosSearch.on('DeviceAvailable', async (device: SonosDevice) => {
        const sonosDevice = await this.getDescription(device);
        const subscribedDevice = await this.subscribeTo(sonosDevice);
        if (subscribedDevice) {
          this.devices.push(subscribedDevice);
        }
      });

      sonosSearch.on('timeout', () => {
        resolve(this.devices);
      });
    });
  }

  private async getDescription(device: SonosDevice): Promise<SonosDevice> {
    const description: {
      roomName: string;
      displayName: string;
      UDN: string;
    } = await device.deviceDescription();
    device.name = description.roomName;
    device.displayName = description.displayName;
    device.id = description.UDN.split('uuid:')[1];
    return device;
  }

  private async subscribeTo(device: SonosDevice): Promise<SonosDevice | null> {
    try {
      await this.listener.subscribeTo(device);
      return device;
    } catch (error) {
      console.log(`Could not subscribe to ${device.name} - ${device.displayName}`);
      return null;
    }
  }
}
