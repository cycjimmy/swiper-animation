/* eslint no-console: 0 */
import path from 'node:path'

import fs from 'fs-extra'

const { readJsonSync, outputJsonSync } = fs

const jsonData = readJsonSync(
  path.resolve('package.json'),
)

if (jsonData.scripts) {
  delete jsonData.scripts
}

if (jsonData.dependencies) {
  delete jsonData.dependencies
}

if (jsonData.devDependencies) {
  delete jsonData.devDependencies
}

// `engines` describes the toolchain of this repository, not the published
// package: the bundled ESM output runs on older Node.js as well.
if (jsonData.engines) {
  delete jsonData.engines
}

// A scoped package without `publishConfig.access` is published as `restricted`,
// which fails on a free npm account the first time this template is copied into
// a new package. Keep the access level only: the registry and tag are decided by
// the release tooling, not by the source package.json.
jsonData.publishConfig = {
  access: jsonData.publishConfig?.access ?? 'public',
}

if (jsonData.config) {
  delete jsonData.config
}

outputJsonSync(
  path.resolve('.release', 'package.json'),
  jsonData,
  {
    spaces: 2,
  },
)

console.log('handlePackageJson success!')
