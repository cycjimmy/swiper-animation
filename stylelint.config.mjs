export default {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-idiomatic-order',
  ],
  overrides: [
    {
      // The demo pages keep their styles inline, so they are linted in place.
      files: ['**/*.html'],
      customSyntax: 'postcss-html',
    },
  ],
}
