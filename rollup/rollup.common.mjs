/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint import/extensions: ["error", "ignorePackages", {"js": off}] */
import eslint from '@rollup/plugin-eslint';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

import myBanner from '@cycjimmy/config-lib/esm/chore/myBanner.js';
import terserOption from '@cycjimmy/config-lib/esm/terser/4.x/production.js';

import pkg from '../package.cjs';

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEPLOYMENT = process.env.NODE_ENV === 'deployment';

export const input = './src/index.js';
export const name = 'SwiperAnimation';
export const banner = myBanner(pkg);

export const plugins = [
  json(),
  eslint({
    fix: true,
    exclude: ['**/*.(css|scss)'],
  }),
  resolve(),
  babel({ babelHelpers: 'bundled' }),
];

export const terserPlugins = IS_PRODUCTION && terser(terserOption);
