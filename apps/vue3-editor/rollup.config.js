import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import vue from 'rollup-plugin-vue';

export default [
  // JS bundles
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/index.esm.js', format: 'esm' },
      { file: 'dist/index.js', format: 'cjs', exports: 'named' },
    ],
    external: [
      'vue',
      '@toast-ui/editor',
      '@toast-ui/editor/dist/toastui-editor.css',
      '@toast-ui/editor/dist/toastui-editor-viewer.css',
    ],
    plugins: [
      vue({ target: 'browser', preprocessStyles: true }),
      resolve({ browser: true }),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
  },
  // Types
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/types.stub.js', format: 'esm' }],
    plugins: [typescript({ tsconfig: './tsconfig.build.json' })],
  },
];
