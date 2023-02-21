/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  preset: 'ts-jest',
  modulePaths: ['node_modules', 'src'],
  testEnvironment: 'node',
  testMatch: ['**/*.integration.test.ts'],
}
