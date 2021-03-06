import { SonosDevice, SonosTrack, SonosZoneGroup } from '../../common/types';

const { DeviceDiscovery, Listener } = require('sonos');

const DISCOVERY_TIMEOUT = 3000;

const IS_MOCK_MODE: boolean = false;
// const MOCK_TRACKS: SonosTrack[] = [
//   {
//     album: 'AlbumName',
//     albumArtURI: 'http://album-art',
//     albumArtURL: 'http://album-art',
//     artist: 'ArtistName',
//     duration: 1000,
//     id: 'track-1',
//     title: 'TrackTitle',
//     position: 10,
//   },
// ];
// const MOCK_DEVICES: any[] = [
//   {
//     id: 'mock-play1-1',
//     name: 'Mock Play 1',
//     displayName: 'Bedroom',
//     host: 'mock host',
//     currentTrack: () => null,
//     deviceDescription: () => null,
//     play: () => null,
//     pause: () => null,
//     previous: () => null,
//     next: () => null,
//     on: null,
//     removeListener: null,
//   },
//   {
//     id: 'mock-play1-2',
//     name: 'Mock Play 1',
//     displayName: 'Office',
//     host: 'mock host',
//     currentTrack: () => {
//       return Promise.resolve(MOCK_TRACKS[0]);
//     },
//     deviceDescription: () => null,
//     play: () => null,
//     pause: () => null,
//     previous: () => null,
//     next: () => null,
//     on: null,
//     removeListener: null,
//   },
// ];

export default class SonosNetwork {
  devices: SonosDevice[] = [];
  zoneGroups: SonosZoneGroup[] = [];
  listener = Listener;
  isReady = false;

  constructor() {}

  public async init() {
    this.devices = await this.discover();
    this.zoneGroups = await this.getAllZoneGroups();
    this.isReady = true;
    console.log(`SonosNetwork::Discovered ${this.devices.length} devices`);
    return this.getDevices();
  }

  public getDevices(): SonosDevice[] {
    // if (IS_MOCK_MODE) {
    //   return MOCK_DEVICES;
    // }
    return this.devices;
  }

  public getZoneGroups(): SonosZoneGroup[] {
    return this.zoneGroups;
  }

  public async getDevice(deviceId: string): Promise<SonosDevice> {
    const devices = this.getDevices();
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

  private async getAllZoneGroups(): Promise<any> {
    const groups: SonosZoneGroup[] = [];

    return new Promise(async (resolve, reject) => {
      const devices = this.getDevices();
      if (devices.length === 0) {
        reject(new Error(`Error:: No ZoneGroups`));
      }

      const rawZoneGroups = await devices[0].getAllGroups();
      rawZoneGroups.forEach((rawZoneGroup: any) => {
        if (!Array.isArray(rawZoneGroup.ZoneGroupMember)) {
          rawZoneGroup.ZoneGroupMember = [rawZoneGroup.ZoneGroupMember];
        }
        const groupCoordinator = rawZoneGroup.ZoneGroupMember.find(
          (member: any) => member.UUID === rawZoneGroup.Coordinator,
        );

        if (!groupCoordinator || groupCoordinator.Invisible) {
          return;
        }

        const coordinator = this.devices.find(device => device.id === rawZoneGroup.Coordinator);
        groups.push({
          id: rawZoneGroup.ID,
          coordinator,
          name: coordinator.name,
          memberIds: rawZoneGroup.ZoneGroupMember.map((member: any) => member.UUID),
        });
      });

      resolve(groups);
    });
  }
}
