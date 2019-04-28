export type SonosDevice = {
  deviceDescription: () => any;
  host: unknown;
  name: string;
  displayName: string;
  id: string;
};

export type IPCEventAppLoaded = {
  type: 'App:loaded';
  payload: {};
};
