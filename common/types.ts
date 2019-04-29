type Sonos = {
  currentTrack: () => any;
  deviceDescription: () => any;
  host: unknown;
};

export type SonosDevice = Sonos & {
  id: string;
  displayName: string;
  name: string;
};

export type SonosTrack = {
  album: string;
  albumArtURI: string;
  albumArtURL: string;
  artist: string;
  duration: number;
  id: string | null;
  title: string;
  position: number;
};

export type IPCMainEvent = IPCEventPayloadSonosReady | IPCEventPayloadSonosCurrentTrack;

export type IPCEventPayloadSonosReady = {
  type: 'SonosNetwork:ready';
  payload: {
    devices: SonosDevice[];
  };
};

export type IPCEventPayloadSonosCurrentTrack = {
  type: 'SonosNetwork:currentTrack';
  payload: {
    track: SonosTrack;
  };
};

export type IPCRendererEvent = IPCEventPayloadAppLoaded | IPCEventPayloadRoomLoaded;

export type IPCEventPayloadAppLoaded = {
  type: 'App:loaded';
  payload?: null;
};

export type IPCEventPayloadRoomLoaded = {
  type: 'Room:loaded';
  payload: {
    deviceId: string;
  };
};
