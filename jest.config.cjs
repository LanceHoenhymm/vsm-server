/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testRegex: '.*\\.spec\\.ts$',
  roots: ['./src', './e2e'],
  moduleFileExtensions: ['ts', 'json', 'js'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
