/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/**/*.test.ts'],
  verbose: true, // test that are set to ignore will still get reported during the test if set to true
  forceExit: true, // exit even if there are pending handlers,
  clearMocks: true,
}
