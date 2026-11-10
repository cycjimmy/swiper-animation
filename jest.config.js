export default {
  // `npm run package` writes a copy of this package into `.release`, and
  // `build:deployment` assembles `.publish`. Without these ignores Jest reports
  // a haste module naming collision for the duplicated package.json and walks
  // generated files it should not touch.
  modulePathIgnorePatterns: [
    '<rootDir>/.release/',
    '<rootDir>/.publish/',
    '<rootDir>/dist/',
  ],
  testEnvironment: 'jsdom',
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
}
