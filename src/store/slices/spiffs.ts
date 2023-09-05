import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { SpiffsFolder, SpiffsState, SpiffsStructure } from '../../types/spiffs';

const initialState: SpiffsState = {
  fileStructure: { path: '', files: [], folders: [] },
  totalSpace: 0,
  usedSpace: 0,
};

export const spiffs = createSlice({
  name: 'spiffs',
  initialState,
  reducers: {
    setSpiffs: (state, action: PayloadAction<string>) => {
      const files = action.payload.split(',');
      const fileStructure: SpiffsStructure = {
        path: '',
        files: [],
        folders: [],
      };

      files.forEach((file) => {
        const path = file.split('/');
        let current = fileStructure;

        for (let i = 0; i < path.length - 1; i++) {
          const currentPath = current.path.length ? `${current.path}/${path[i]}` : path[i];
          const index = current.folders.findIndex(
            (folder: SpiffsFolder) => folder.path === currentPath
          );
          if (index === -1) {
            current.folders.push({
              path: current.path.length ? `${current.path}/${path[i]}` : path[i],
              name: path[i],
              files: [],
              folders: [],
            });
            current = current.folders[current.folders.length - 1];
          } else {
            current = current.folders[index];
          }
        }

        current.files.push({
          path: current.path.length ? `${current.path}` : '',
          name: path[path.length - 1],
        });
      });

      state.fileStructure = fileStructure;
    },
    setSpiffsSize: (state, action: PayloadAction<{ total: number; used: number }>) => {
      state.totalSpace = action.payload.total;
      state.usedSpace = action.payload.used;
    },
    addFolder: (state, action: PayloadAction<{ path: string; name: string }>) => {
      const fileStructure = state.fileStructure;
      const name = action.payload.name;

      const paths = action.payload.path.split('/');
      let current = fileStructure;

      if (paths[paths.length - 1] !== '') {
        for (let i = 0; i < paths.length; i++) {
          const index = current.folders.findIndex(
            (folder: SpiffsFolder) => folder.name === paths[i]
          );
          current = current.folders[index];
        }
      }

      if (current.folders.find((folder: SpiffsFolder) => folder.name === name)) {
        throw new Error('Folder already exists');
      }

      current.folders.push({
        path: current.path.length ? `${current.path}/${name}` : name,
        name: name,
        files: [],
        folders: [],
      });
    },
  },
});

export const { setSpiffs, setSpiffsSize, addFolder } = spiffs.actions;

export default spiffs.reducer;
