import { PayloadAction, createSlice } from '@reduxjs/toolkit';

/* Editor modes */
export const mode = {
  error: -1,
  idle: 0,
  run: 1,
  debug: 2,
  debug_play: 3,
  debug_until: 4,
  debug_observe: 5,
  debug_pause: 6,
};

export interface EditorError {
  message: string;
  line: number;
  column: number;
}

export interface Script {
  id: string;
  name: string;
  content: string;
  changedAt: number;
}

interface EditorState {
  code: string;
  fileName: string;
  userScripts: Script[];
  error: EditorError | null;
  showDeviceState: boolean;
  highlightedLines: number[];
  breakpointLine: number;
  mode: number;
  scrollTop: boolean;
  observeSpeed: number;
}

const initialState: EditorState = {
  code: 'background(0,0,0)\nnoStroke()\n\ndef onDraw():\n\tfor i in 20:\n\t\tfill(random(0, 240), random(0, 240), random(0,240))\n\t\tdrawRectangle(1 + random(0, 12) * 20, 1 + random(0, 12) * 20, 18, 18)\n\tupdate()\n\tif getButton():\n\t\tif returnToMenu():\n\t\t\treturn\n',
  fileName: 'My new script',
  userScripts: [],
  error: null,
  showDeviceState: false,
  highlightedLines: [],
  breakpointLine: 0,
  mode: mode.idle,
  scrollTop: false,
  observeSpeed: 500,
};

export const editor = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<EditorError>) => {
      state.error = action.payload;
      state.mode = mode.error;
    },
    resetError: (state) => {
      state.error = initialState.error;
      state.mode = initialState.mode;
    },
    highlightLine: (state, action: PayloadAction<number>) => {
      if (action.payload === 0 || !state.showDeviceState) {
        state.highlightedLines = [];
      } else {
        const lines = state.highlightedLines;
        lines.unshift(action.payload);
        state.highlightedLines = lines.slice(0, 6);
      }
    },
    setBreakpoint: (state, action: PayloadAction<number>) => {
      if (state.breakpointLine === action.payload) {
        state.breakpointLine = 0;
      } else {
        state.breakpointLine = action.payload;
      }
    },
    setMode: (state, action: PayloadAction<number>) => {
      if (state.showDeviceState) {
        state.mode = action.payload;
      } else {
        state.mode = initialState.mode;
      }
    },
    setScrollTop: (state, action: PayloadAction<boolean>) => {
      state.scrollTop = action.payload;
    },
    setObserveSpeed: (state, action: PayloadAction<number>) => {
      state.observeSpeed = action.payload;
    },
    loadCode: (state) => {
      state.fileName = localStorage.getItem('editor.fileName') ?? initialState.fileName;
      const encodedCode = localStorage.getItem('editor.code');
      if (encodedCode) state.code = window.atob(encodedCode);
      else state.code = initialState.code;
      const scriptString = localStorage.getItem('editor.user_scripts') ?? '[]';
      const userScripts = JSON.parse(scriptString);
      state.userScripts = userScripts;
    },
    saveUserScripts: (state, action: PayloadAction<Script[]>) => {
      localStorage.setItem('editor.user_scripts', JSON.stringify(action.payload));
      state.userScripts = action.payload;
    },
    setCode: (state, action: PayloadAction<Script>) => {
      const script = action.payload;
      localStorage.setItem('editor.fileName', script.name);
      localStorage.setItem('editor.code', script.content);
      state.fileName = script.name;
      state.code = window.atob(script.content);
      state.error = initialState.error;
      state.mode = initialState.mode;
      state.highlightedLines = initialState.highlightedLines;
      state.breakpointLine = initialState.breakpointLine;
      state.showDeviceState = initialState.showDeviceState;
    },
    changeCode: (state, action: PayloadAction<string>) => {
      const newCode = action.payload;
      if (newCode.localeCompare(state.code) !== 0) {
        localStorage.setItem('editor.code', window.btoa(newCode));
        state.code = newCode;

        /* Check if there is a script withe the current file name */
        if (state.userScripts.find((script) => script.name === state.fileName) !== undefined) {
          /* Change the code of the script */
          const newUserScripts = state.userScripts.map((script) => {
            if (script.name === state.fileName) {
              return { ...script, content: window.btoa(newCode), changedAt: Date.now() };
            } else {
              return script;
            }
          });
          state.userScripts = newUserScripts;
          localStorage.setItem('editor.user_scripts', JSON.stringify(newUserScripts));
        } else {
          /* Create a new script with the current name and code */
          const newScript: Script = {
            id: crypto.randomUUID(),
            name: state.fileName,
            content: window.btoa(newCode),
            changedAt: Date.now(),
          };
          const newUserScripts = [...state.userScripts, newScript];
          state.userScripts = newUserScripts;
          localStorage.setItem('editor.user_scripts', JSON.stringify(newUserScripts));
        }

        state.error = initialState.error;
        state.mode = initialState.mode;
        state.highlightedLines = initialState.highlightedLines;
        state.breakpointLine = initialState.breakpointLine;
        state.showDeviceState = initialState.showDeviceState;
      }
    },
    changeName: (state, action: PayloadAction<string>) => {
      const name = action.payload;
      localStorage.setItem('editor.fileName', name);
      state.fileName = name;
    },
    setShowDeviceState: (state, action: PayloadAction<boolean>) => {
      state.showDeviceState = action.payload;
      if (!action.payload) {
        state.error = initialState.error;
        state.mode = initialState.mode;
        state.highlightedLines = initialState.highlightedLines;
        state.breakpointLine = initialState.breakpointLine;
      }
    },
  },
});

export const {
  setError,
  resetError,
  highlightLine,
  setBreakpoint,
  setMode,
  setScrollTop,
  setObserveSpeed,
  loadCode,
  saveUserScripts,
  setCode,
  changeCode,
  changeName,
  setShowDeviceState,
} = editor.actions;

export default editor.reducer;
