import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { ThemeName } from '../../theme';

interface LayoutState {
  isMenuOpen: boolean;
  theme: ThemeName;
  snapshotLoading: boolean;
  snapshotAvailable: boolean;
  selectedMenu: number;
  showFileBrowser: boolean;
}

const initialState: LayoutState = {
  isMenuOpen: true,
  theme: 'dark',
  snapshotLoading: false,
  snapshotAvailable: false,
  selectedMenu: 0,
  showFileBrowser: false,
};

export const layout = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    toggleMenu: (state) => {
      localStorage.setItem('editor.isMenuOpen', JSON.stringify(!state.isMenuOpen));
      state.isMenuOpen = !state.isMenuOpen;
    },
    setTheme: (state, action: PayloadAction<LayoutState['theme']>) => {
      localStorage.setItem('editor.theme', action.payload);
      state.theme = action.payload;
    },
    loadLayout: (state) => {
      state.isMenuOpen = localStorage.getItem('editor.isMenuOpen') === 'false' ? false : true;
      state.theme = (localStorage.getItem('editor.theme') as ThemeName) ?? initialState.theme;
      state.selectedMenu = JSON.parse(localStorage.getItem('editor.selectedMenu') ?? '0');
    },
    setSnapshotLoading: (state) => {
      state.snapshotLoading = true;
    },
    setSnapshotAvailable: (state, action: PayloadAction<boolean>) => {
      state.snapshotAvailable = action.payload;
      state.snapshotLoading = false;
    },
    selectMenu: (state, action: PayloadAction<number>) => {
      localStorage.setItem('editor.selectedMenu', JSON.stringify(action.payload));
      state.selectedMenu = action.payload;
    },
    setShowFileBrowser: (state, action: PayloadAction<boolean>) => {
      state.showFileBrowser = action.payload;
    },
  },
});

export const {
  toggleMenu,
  setTheme,
  loadLayout,
  setSnapshotLoading,
  setSnapshotAvailable,
  selectMenu,
  setShowFileBrowser,
} = layout.actions;

export default layout.reducer;
