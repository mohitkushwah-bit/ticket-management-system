/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/../../tests/backend'],
  testMatch: ['**/*.test.ts'],
  globalSetup: '<rootDir>/test-support/global-setup.ts',
  globalTeardown: '<rootDir>/test-support/global-teardown.ts',
  moduleDirectories: ['node_modules', '<rootDir>/node_modules'],
  moduleNameMapper: {
    '^mime$': '<rootDir>/test-support/mime-shim.cjs',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      { tsconfig: '<rootDir>/../../tests/backend/tsconfig.json' },
    ],
  },
};
