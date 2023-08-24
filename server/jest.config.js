/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ci: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/controllers/**/*.ts'],
  displayName: 'Server',
  preset: 'ts-jest',
  reporters: [
    'default',
    [
      '../node_modules/jest-html-reporter',
      {
        pageTitle: 'Pre Build Tests',
        outputPath: 'pre-build-tests.html',
        includeFailureMsg: true,
        includeStackTrace: true,
        includeSuiteFailure: true,
      },
    ],
  ],
  testEnvironment: 'node',
  verbose: true,
};
