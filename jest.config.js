const expoPreset = require('jest-expo/jest-preset.js');
const jestPreset = require('@testing-library/react-native/jest-preset');

module.exports = {
  setupFiles: [...expoPreset.setupFiles, ...jestPreset.setupFiles],
  // preset: 'jest-expo',
  // transformIgnorePatterns: [
  //   'node_modules/(?!(jest-)?react-native|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*)',
  // ],
  // collectCoverageFrom: ['src/**/*.{js,jsx}'],
};
