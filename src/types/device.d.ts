export type RunMode = 'RUN' | 'DEBUG_PLAY' | 'DEBUG_UNTIL' | 'DEBUG_OBSERVE' | 'DEBUG_PAUSE';

export type HeadState = {
  error_id: number;
  error_text: string;
  run_mode: RunMode;
  source_line: number;
};

export type GlobalsState = object;
export type LocalsState = object;
export type ObjectState = object;

export type DeviceInfo = {
  uuid: string;
  supType: string;
  hwVersion: string;
  fwVersion: string;
};

export type DeviceInfoPayload = {
  uuid_short: string;
  sub_type: string;
  hw_version: string;
  fw_version: string;
};

export type DeviceState = {
  head: HeadState;
  globals?: GlobalsState;
  locals?: LocalsState;
  objects?: ObjectState;
  isConnected: boolean;
  deviceInfo: DeviceInfo;
};

export type DeviceStatePayload = Omit<DeviceState, 'isConnected' | 'deviceInfo'>;
