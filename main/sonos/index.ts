const { DeviceDiscovery } = require('sonos');

type SonosDevice = any & {
  deviceDescription: () => any;
  host: string;

  //
  name: string;
  displayName: string;
  id: string;
};

export default class SonosNetwork {
  devices: SonosDevice[] = [];
  zoneGroups: any[] = [];

  constructor() {}

  init() {
    // event on all found...
    DeviceDiscovery((sonosDevice: SonosDevice) => {
      const device = sonosDevice;
      device
        .deviceDescription()
        .then((description: { roomName: string; displayName: string; UDN: string }) => {
          device.name = description.roomName;
          device.displayName = description.displayName;
          const UUID = description.UDN.split('uuid:')[1];
          device.id = UUID;
        });

      this.devices.push(device);
      console.log('found device at', device.host);
      // mute every device...
      // device.setMuted(true).then(`${device.host} now muted`);
    });

    // find one device
    // DeviceDiscovery().once('DeviceAvailable', (sonosDevice: SonosDevice) => {
    //   console.log(this.devices);

    //   // get all groups
    //   device.getAllGroups().then(console.log);
    // });
  }
}
