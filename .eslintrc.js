module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'arrow-body-style': 'off',
    'linebreak-style': 'off',
    'indent': 'off',
    'quote-props': 'off',
    'comma-dangle': 'off',
    'eol-last': 'off',
    'no-unused-vars': 'off',
    'max-len': 'off',
    'consistent-return': 'off',
    'new-cap': 'off',
    'no-console': 'off',
    'import/no-extraneous-dependencies': 'off',
    'newline-per-chained-call': 'off'
  },
};
