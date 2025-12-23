import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createProxy } from './proxy';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    base: './',
    server: {
      cors: true,
      port: 3000,
      proxy: createProxy(mode),
    },
    resolve: {
      alias: { '@': '/src' },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
  };
});
