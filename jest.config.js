module.exports = {
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  modulePaths: [
    '<rootDir>'
  ],
  globals: {
    lo_: require('lodash')
  }
}
