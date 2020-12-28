module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ['airbnb-base', '../.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
};
