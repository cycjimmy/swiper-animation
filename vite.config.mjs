import { createRequire } from 'node:module'

import myBanner from '@cycjimmy/config-lib/esm/chore/myBanner.js'
import terserOption from '@cycjimmy/config-lib/esm/terser/4.x/production.js'
import { defineConfig } from 'vite'

const pkg = createRequire(import.meta.url)('./package.json')

// config-lib's shared option follows terser 4's legacy `output` key. Vite 8 always
// injects `format` and terser rejects having both, so convert `output` → `format`.
const { output, ...restTerserOption } = terserOption
const terserOptions = { ...restTerserOption, format: output }

// Output file names follow the pkg field conventions of the old rollup configs.
const esmFileName = pkg.module.replace('dist/', '') // swiper-animation.esm.js
const umdFileName = pkg.unpkg.replace('dist/', '').replace('.min.js', '.js') // swiper-animation.umd.js
const umdMinFileName = pkg.unpkg.replace('dist/', '') // swiper-animation.umd.min.js

// Prepends the banner to the entry chunk. `generateBundle` runs after terser's
// `renderChunk` hook, so the banner is never minified away.
function banner(bannerText) {
  return {
    name: 'banner',
    enforce: 'post',
    generateBundle(_options, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type === 'chunk' && chunk.isEntry)
          chunk.code = `${bannerText}\n${chunk.code}`
      }
    },
  }
}

function libBuild({ formats, fileName, minify = false }) {
  return {
    target: 'es2015',
    outDir: 'dist',
    // Keep artifacts of the previous incremental builds (`npm run build` cleans dist first).
    emptyOutDir: false,
    cssCodeSplit: false,
    minify,
    ...(minify === 'terser' && { terserOptions }),
    lib: {
      entry: 'src/index.js',
      name: 'SwiperAnimation',
      formats,
      fileName: () => fileName,
    },
    rollupOptions: {
      output: {
        exports: 'default',
      },
    },
  }
}

const builds = {
  'esm': libBuild({
    formats: ['es'],
    fileName: esmFileName,
  }),
  'umd': libBuild({
    formats: ['umd'],
    fileName: umdFileName,
  }),
  'umd-min': libBuild({
    formats: ['umd'],
    fileName: umdMinFileName,
    minify: 'terser',
  }),
  'deployment': libBuild({
    formats: ['umd'],
    fileName: umdFileName,
  }),
}

export default defineConfig(({ mode }) => {
  const build = builds[mode]

  return {
    // Avoid copying static/ (or any public dir) into dist and polluting .release.
    publicDir: false,
    plugins: [
      mode === 'umd-min' && banner(myBanner(pkg)),
    ],
    ...(build && { build }),
  }
})
