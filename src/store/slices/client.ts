import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface ClientState {
  language: 'de' | 'en' | 'fr';
}

const initialState: ClientState = {
  language: 'de',
};

export const client = createSlice({
  name: 'client',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<ClientState['language']>) => {
      localStorage.setItem('editor.language', action.payload);
      state.language = action.payload;
    },
    loadClient: (state) => {
      const language = localStorage.getItem('editor.language') ?? 'de';
      state.language = language as ClientState['language'];
    },
  },
});

export const { setLanguage, loadClient } = client.actions;

export default client.reducer;
