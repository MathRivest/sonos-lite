export type SonosDevice = {
  deviceDescription: () => any;
  host: unknown;
  name: string;
  displayName: string;
  id: string;
};

export type IPCEventPayloadAppLoaded = {
  type: 'App:loaded';
  payload?: null;
};

export type IPCEventPayloadSonosReady = {
  type: 'SonosNetwork:ready';
  payload: {
    devices: SonosDevice[];
  };
};

export type IPCEventPayload = IPCEventPayloadAppLoaded | IPCEventPayloadSonosReady;
