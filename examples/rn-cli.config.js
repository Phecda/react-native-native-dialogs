/**
 * This file overrides metro config so
 */
'use strict';

const path = require('path');
const blacklist = require('metro-config/src/defaults/blacklist');

const RNNDRoot = path.resolve(__dirname, '..');

module.exports = {
  watchFolders: [path.resolve(__dirname, 'node_modules'), RNNDRoot],
  resolver: {
    blacklistRE: blacklist([new RegExp(`${RNNDRoot}/node_modules/react-native/.*`)]),
  },
};