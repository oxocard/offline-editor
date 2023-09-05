/* Code modes payloads */
export const runCodePayload = (code: string) => {
  return {
    type: 'script',
    mode: 'run',
    content: code,
  };
};

export const debugCodePayload = (code: string) => {
  return {
    type: 'script',
    mode: 'debug',
    content: code,
  };
};

/* Debug payloads */
export const debugRunPayload = () => {
  return {
    type: 'debug',
    content: 'play',
  };
};

export const debugObservePayload = (speed: number) => {
  return {
    type: 'debug',
    content: 'observe',
    delay: speed,
  };
};

export const debugPausePayload = () => {
  return {
    type: 'debug',
    content: 'pause',
  };
};

export const debugStepPayload = () => {
  return {
    type: 'debug',
    content: 'step',
  };
};

export const debugBreakpointPayload = (line: number) => {
  return {
    type: 'debug',
    content: 'breakpoint',
    line: line,
  };
};

export const debugStepToBreakpointPayload = () => {
  return {
    type: 'debug',
    content: 'step_to_breakpoint',
  };
};

/* Command payloads */
export const restartCardPayload = () => {
  return {
    type: 'command',
    content: 'restart',
  };
};

export const hwResetCardPayload = () => {
  return {
    type: 'command',
    content: 'hw_reset',
  };
};

export const pingPayload = () => {
  return {
    type: 'command',
    content: 'ping',
  };
};

export const enablePrintPayload = () => {
  return {
    type: 'command',
    content: 'print_enable',
  };
};

export const disablePrintPayload = () => {
  return {
    type: 'command',
    content: 'print_disable',
  };
};

export const statePayload = () => {
  return {
    type: 'command',
    content: 'state',
  };
};

export const getDeviceInfosPayload = () => {
  return {
    type: 'command',
    content: 'get_device',
  };
};

export const getPongPayload = () => {
  return {
    type: 'command',
    content: 'pong',
  };
};

export const getUtcResponsePayload = () => {
  return {
    type: 'command',
    content: 'get_time_response',
    utc: Math.floor(new Date().getTime() / 1000),
  };
};

export const snapshotPayload = () => {
  return {
    type: 'command',
    content: 'snapshot',
  };
};

/* SPIFFS payloads */
export const readSpiffsDirectoryPayload = (path: string) => {
  return {
    type: 'dir',
    name: path,
  };
};

export const writeSpiffsFilePayload = (path: string, content: string) => {
  return {
    type: 'file',
    mode: 'w',
    name: path,
    content,
  };
};

export const writeBinarySpiffsFilePayload = (path: string, content: string) => {
  return {
    type: 'file',
    mode: 'wb',
    name: path,
    content,
  };
};

export const appendSpiffsFilePayload = (path: string, content: string) => {
  return {
    type: 'file',
    mode: 'a',
    name: path,
    content,
  };
};

export const appendBinarySpiffsFilePayload = (path: string, content: string) => {
  return {
    type: 'file',
    mode: 'ab',
    name: path,
    content,
  };
};

export const readSpiffsFilePayload = (path: string, offset?: number, size?: number) => {
  return {
    type: 'file',
    mode: 'r',
    name: path,
    offset,
    size,
  };
};

export const deleteSpiffsFilePayload = (path: string) => {
  return {
    type: 'file',
    mode: 'd',
    name: path,
  };
};

export const renameSpiffsFilePayload = (path: string, newPath: string) => {
  return {
    type: 'file',
    mode: 'mv',
    name: path,
    content: newPath,
  };
};

export const getSpiffsSizePayload = () => {
  return {
    type: 'command',
    content: 'get_spiffs_size',
  };
};
