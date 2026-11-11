/**
 * Cross-environment Platform Helper
 * Scripts by Darchesa
 */

let PlatformHelper;

try {
  const RN = require('react-native');
  if (RN && RN.Platform) {
    PlatformHelper = RN.Platform;
  }
} catch (e) {
  // Fallback for non-RN test runners
}

if (!PlatformHelper) {
  const isWeb = typeof window !== 'undefined';
  PlatformHelper = {
    OS: isWeb ? 'web' : 'android',
    select: (spec) => (isWeb && spec.web ? spec.web : spec.default || spec.android || spec.ios),
  };
}

export default PlatformHelper;
export { PlatformHelper as Platform };
