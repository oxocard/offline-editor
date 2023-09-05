import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface LogEntry {
  timestamp: number;
  message: string;
  time: number;
}

interface TerminalState {
  logs: LogEntry[];
}

const initialState: TerminalState = {
  logs: [],
};

export const terminal = createSlice({
  name: 'terminal',
  initialState,
  reducers: {
    addLog: (state, action: PayloadAction<LogEntry>) => {
      let logs = state.logs;
      /* If the log has a timestamp we check the order */
      if (action.payload.time) {
        const newestLog = logs[logs.length - 1];
        /* Check if the last logs time is greater than the new ones and the diff is not too big (would have been a reset) */
        if (newestLog?.time > action.payload.time && newestLog.time - action.payload.time < 1000) {
          /* If the order is wrong get the right index and insert the log */
          const timeIndex = logs.findIndex((log) => log.time > action.payload.time);
          logs.splice(timeIndex, 0, action.payload);
        } else {
          logs.push(action.payload);
        }
      } else {
        logs.push(action.payload);
      }
      logs = logs.slice(-1000);
      state.logs = logs;
    },
    clearLog: (state) => {
      state.logs = initialState.logs;
    },
  },
});

export const { addLog, clearLog } = terminal.actions;

export default terminal.reducer;
