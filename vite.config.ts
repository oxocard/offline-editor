import { PluginOption, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monacoEditorPlugin, { IMonacoEditorOpts } from 'vite-plugin-monaco-editor';
import svgr from 'vite-plugin-svgr';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const monacoEditorPluginDefault = (monacoEditorPlugin as any).default as (
  options: IMonacoEditorOpts
) => PluginOption;

// https://vitejs.dev/config/
export default defineConfig({
  preview: {
    port: 1777,
  },
  server: {
    port: 1777,
  },
  resolve: {
    alias: {
      '@mui/styled-engine': '@mui/styled-engine-sc',
    },
  },
  plugins: [react(), monacoEditorPluginDefault({}), svgr()],
});
