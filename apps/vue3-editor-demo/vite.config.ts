import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      // Qualsiasi import di @toast-ui/editor deve finire su @toast-ui/editor-npm
      {
        find: /^@toast-ui\/editor$/,
        replacement: resolve(__dirname, 'node_modules/@toast-ui/editor-npm/dist/toastui-editor.js'),
      },
      {
        find: /^@toast-ui\/editor\/dist\/toastui-editor\.css$/,
        replacement: resolve(
          __dirname,
          'node_modules/@toast-ui/editor-npm/dist/toastui-editor.css'
        ),
      },
      {
        find: /^@toast-ui\/editor\/dist\/toastui-editor-viewer\.css$/,
        replacement: resolve(
          __dirname,
          'node_modules/@toast-ui/editor-npm/dist/toastui-editor-viewer.css'
        ),
      },
      {
        find: /^@toast-ui\/editor\/dist\/toastui-editor-viewer$/,
        replacement: resolve(
          __dirname,
          'node_modules/@toast-ui/editor-npm/dist/toastui-editor-viewer.js'
        ),
      },
    ],
    dedupe: ['vue'],
  },
});
