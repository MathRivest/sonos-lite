type Sonos = {
  host: unknown;
  avTransportService: () => {
    CurrentTrack: () => Promise<SonosTrack>;
  };
  currentTrack: () => Promise<SonosTrack>;
  deviceDescription: () => any;
  getCurrentState: () => Promise<SonosPlayState>;
  next: () => Promise<void>;
  on: (eventName: string, handler: (arg: any) => void) => void;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  previous: () => Promise<void>;
  removeListener: (eventName: string, handler: (arg: any) => void) => void;
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
  position?: number;
};

export type SonosPlayState = 'playing' | 'paused' | 'stopped' | 'transitionning';

export type IPCMainEvent =
  | IPCEventPayloadSonosReady
  | IPCEventPayloadSonosCurrentTrack
  | IPCEventPayloadSonosCurrentPartialTrack
  | IPCEventPayloadSonosPlayState;

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

export type IPCEventPayloadSonosCurrentPartialTrack = {
  type: 'SonosNetwork:currentPartialTrack';
  payload: {
    track: Partial<SonosTrack>;
  };
};
export type IPCEventPayloadSonosPlayState = {
  type: 'SonosNetwork:playState';
  payload: {
    playState: SonosPlayState;
  };
};

export type IPCRendererEvent =
  | IPCEventPayloadAppLoaded
  | IPCEventPayloadRoomLoaded
  | IPCEventPayloadRoomChanged
  | IPCEventPayloadPlayerCommand
  | IPCEventPayloadPlayerGetPosition;

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

export type IPCEventPayloadRoomChanged = {
  type: 'Room:changed';
  payload?: null;
};

export type IPCEventPayloadPlayerCommand = {
  type: 'Player:command';
  payload: {
    deviceId: string;
    command: 'play' | 'pause' | 'previous' | 'next';
  };
};

export type IPCEventPayloadPlayerGetPosition = {
  type: 'Player:getPosition';
  payload: {
    deviceId: string;
  };
};
