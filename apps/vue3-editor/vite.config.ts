import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'TuiEditorVue3',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.esm.js' : 'index.cjs.js'),
    },
    rollupOptions: {
      external: [
        'vue',
        '@toast-ui/editor',
        '@toast-ui/editor/dist/toastui-editor.css',
        '@toast-ui/editor/dist/toastui-editor-viewer.css',
      ],
    },
  },
});
