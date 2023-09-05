import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { DeviceInfoPayload, DeviceState, DeviceStatePayload } from '../../types/device';

const initialState: DeviceState = {
  head: {
    error_id: 0,
    error_text: '',
    run_mode: 'RUN',
    source_line: 0,
  },
  globals: {},
  locals: {},
  objects: {},
  isConnected: false,
  deviceInfo: {
    uuid: '',
    supType: '',
    hwVersion: '',
    fwVersion: '',
  },
};

export const device = createSlice({
  name: 'device',
  initialState,
  reducers: {
    setConnected: (state) => {
      state.isConnected = true;
    },
    setDisconnected: (state) => {
      state.isConnected = false;
      state.deviceInfo = initialState.deviceInfo;
      state.head = initialState.head;
      state.globals = initialState.globals;
      state.locals = initialState.locals;
      state.objects = initialState.objects;
    },
    setStatus: (state, action: PayloadAction<DeviceStatePayload>) => {
      state.head = action.payload.head;
      state.globals = action.payload.globals;
      state.locals = action.payload.locals;
      state.objects = action.payload.objects;
    },
    setDeviceInfos: (state, action: PayloadAction<DeviceInfoPayload>) => {
      state.deviceInfo.uuid = action.payload.uuid_short;
      state.deviceInfo.supType = action.payload.sub_type;
      state.deviceInfo.hwVersion = action.payload.hw_version;
      state.deviceInfo.fwVersion = action.payload.fw_version;
    },
  },
});

export const { setConnected, setDisconnected, setStatus, setDeviceInfos } = device.actions;

export default device.reducer;
