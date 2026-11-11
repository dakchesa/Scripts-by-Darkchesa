/**
 * React Native Module Mock for Node Testing
 */

const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function (id) {
  if (id === 'react-native') {
    return {
      Platform: {
        OS: 'web',
        select: (obj) => obj.web || obj.default,
      },
      Alert: {
        alert: () => {},
      },
      StyleSheet: {
        create: (styles) => styles,
        hairlineWidth: 1,
      },
    };
  }
  return originalRequire.apply(this, arguments);
};

require('./verify_app');
