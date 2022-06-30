import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import eslint from '@rollup/plugin-eslint';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import scss from 'rollup-plugin-scss';
import { terser } from 'rollup-plugin-terser';
import cleanup from 'rollup-plugin-cleanup';
import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import path from 'path';

// 檔名
const name = 'index';

// 當前執行指令路徑
const root = process.cwd();

module.exports = {
  input: 'src/index.js',
  output: [
    {
      file: `dist/${name}.umd.js`,
      format: 'umd',
      sourcemap: true,
      name: 'TableCRUD',
      globals: {
        jquery: '$',
        'bootstrap4-dialog': 'BootstrapDialog',
      },
    },
  ],
  plugins: [
    eslint({
      parser: '@babel/eslint-parser',
      throwOnError: true,
      include: ['src/**/*.js'],
      exclude: ['node_modules/**', 'dist/**'],
    }),
    json(),
    alias({
      entries: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    }),
    nodeResolve({ mainFields: ['jsnext', 'preferBuiltins', 'browser'] }),
    commonjs({
      transformMixedEsModules: true,
      include: ['node_modules/**', 'src/**'],
      extensions: ['.js'],
    }),
    babel({
      babelrc: false,
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            // 按需轉譯
            useBuiltIns: 'usage',
            corejs: 3,
          },
        ],
      ],
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: 3,
          },
        ],
      ],
      extensions: ['.js'],
    }),
    cleanup({ comments: 'istanbul', extensions: ['js'] }),
    optimizeLodashImports(),
    terser(),
    scss({
      output: './dist/index.css',
      runtime: require('sass'),
      sourceMap: true,
    }),
    serve({
      open: true,
      port: 9425,
      openPage: '/index.html',
      historyApiFallback: 'public/index.html',
      contentBase: [path.resolve(root, 'dist'), path.resolve(root, 'public')],
      onListening: function (server) {
        console.log('\x1B[33m%s\x1b[0m:', 'The rollup dev Serve is start!');

        const address = server.address();
        const host = address.address === '::' ? 'localhost' : address.address;
        // by using a bound function, we can access options as `this`
        const protocol = this.https ? 'https' : 'http';

        console.log('\x1B[36m%s\x1B[0m', `Serve is listening in ${address.port}`);
        console.log(
          '\x1B[35m%s\x1B[39m',
          `You can click ${protocol}://${host}:${address.port}/ go to Browser`
        );
        console.log(
          '\x1B[34m%s\x1B[39m',
          `You can click ${protocol}://localhost:${address.port}/ go to Browser`
        );
      },
    }),
    livereload(),
  ],
  external: ['jquery', 'bootstrap4-dialog'],
};
