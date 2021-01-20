module.exports = {
  plugins: [
    'import'
  ],
  rules: {
    'arrow-parens': 0,
    'brace-style': ['error', 'stroustrup'],
    'comma-dangle': 0,
    'guard-for-in': 0,
    'import/extensions': ['error', 'ignorePackages'],
    'linebreak-style': 0,
    'max-len': ['warn', { "code": 160 }],
    'no-plusplus': ["error", { "allowForLoopAfterthoughts": true }],
    'no-restricted-syntax': 0,
    'no-underscore-dangle': 0,
    'object-curly-newline': 0,
    'quotes': 0,
    'react/forbid-prop-types': 0
  }
};
