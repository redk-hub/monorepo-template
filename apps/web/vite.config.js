import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createProxy } from './proxy';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    server: {
      proxy: createProxy(mode),
    },
    // add less preprocessor options so .less files are handled and Ant Design works
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
  };
});
