import { SonosDevice, SonosTrack } from '../../common/types';

const { DeviceDiscovery, Listener } = require('sonos');

const DISCOVERY_TIMEOUT = 3000;

const IS_MOCK_MODE: boolean = false;
const MOCK_DEVICES: SonosDevice[] = [
  {
    id: 'mock-play1-1',
    name: 'Mock Play 1',
    displayName: 'Bedroom',
    host: 'mock host',
    currentTrack: () => null,
    deviceDescription: () => null,
    play: () => null,
    pause: () => null,
    previous: () => null,
    next: () => null,
  },
  {
    id: 'mock-play1-2',
    name: 'Mock Play 1',
    displayName: 'Office',
    host: 'mock host',
    currentTrack: () => {
      return {
        album: 'AlbumName',
        albumArtURI: 'http://album-art',
        albumArtURL: 'http://album-art',
        artist: 'ArtistName',
        duration: 1000,
        id: 'track-1',
        title: 'TrackTitle',
        position: 10,
      };
    },
    deviceDescription: () => null,
    play: () => null,
    pause: () => null,
    previous: () => null,
    next: () => null,
  },
];

export default class SonosNetwork {
  devices: SonosDevice[] = [];
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
    if (IS_MOCK_MODE) {
      return MOCK_DEVICES;
    }
    return this.devices;
  }

  public async getDevice(deviceId: string): Promise<SonosDevice> {
    const devices = await this.getDevices();
    return devices.find(device => device.id === deviceId);
  }

  public async getDeviceTrack(deviceId: string): Promise<SonosTrack> {
    const device = await this.getDevice(deviceId);
    return device.currentTrack();
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
