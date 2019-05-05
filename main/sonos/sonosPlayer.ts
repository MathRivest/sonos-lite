import SonosNetwork from './sonosNetwork';
import { SonosDevice } from '../../common/types';

export default class SonosPlayer {
  sonosNetwork: SonosNetwork;
  activeDevice: SonosDevice | null;

  constructor(sonosNetwork: SonosNetwork) {
    this.sonosNetwork = sonosNetwork;
  }

  public setActiveDevice = async (deviceId: string): Promise<void> => {
    if (!this.activeDevice || this.activeDevice.id !== deviceId) {
      const device = await this.sonosNetwork.getDevice(deviceId);
      this.activeDevice = device;
    }
  };

  public sendCommand = (command: string) => {
    const commandMap: { [command: string]: () => void } = {
      play: this.play,
      pause: this.pause,
      previous: this.previous,
      next: this.next,
      getPosition: this.getPosition,
    };
    commandMap[command]();
  };

  // Todo: improve this
  async getPosition(): Promise<number> {
    if (this.activeDevice) {
      const track = await this.activeDevice.avTransportService().CurrentTrack();
      return track.position;
    }
    return null;
  }

  private play = async () => {
    try {
      await this.activeDevice.play();
    } catch (error) {
      console.log('An error occured trying to play');
    }
  };

  private pause = async () => {
    try {
      await this.activeDevice.pause();
    } catch (error) {
      console.log('An error occured trying to pause');
    }
  };

  private previous = async () => {
    try {
      await this.activeDevice.previous();
    } catch (error) {
      console.log('An error occured trying to previous');
    }
  };

  private next = async () => {
    try {
      await this.activeDevice.next();
    } catch (error) {
      console.log('An error occured trying to next');
    }
  };
}
