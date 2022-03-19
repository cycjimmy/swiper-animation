/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const makeCommonConfig = require('@cycjimmy/config-lib/cjs/semanticRelease/15.x/makeCommonConfig.cjs')
  .default;

const pkg = require('./package.json');

module.exports = makeCommonConfig({
  githubOptions: {
    assets: [pkg.browser],
  },
  exec: true,
  execOptions: {
    publishCmd: 'npm run build',
  },
});
