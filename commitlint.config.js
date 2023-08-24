module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-length': [1, 'always', 50],
    'body-case': [1, 'always', 'start-case'],
    'references-empty': [1, 'never'],
  },
};
