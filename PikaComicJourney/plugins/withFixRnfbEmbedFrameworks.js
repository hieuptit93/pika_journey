const { withPodfile } = require('@expo/config-plugins');

// @react-native-firebase/app injects a "[RNFB] Embed Firebase SPM Frameworks"
// build phase directly into the Xcode project while `pod install` runs (not
// via an Expo JS config plugin), so it cannot be patched at `withXcodeProject`
// time — that mod runs *before* pod install. Instead we hook Podfile's
// `post_integrate`, which CocoaPods runs only after the final project.pbxproj
// has been written to disk, and run a Node script there to fix it up.
// See scripts/fix-rnfb-embed-frameworks.js for what's actually broken/patched.
const MARKER = '# --- withFixRnfbEmbedFrameworks ---';

function withFixRnfbEmbedFrameworks(config) {
  return withPodfile(config, (config) => {
    const contents = config.modResults.contents;

    if (contents.includes(MARKER)) {
      return config;
    }

    const hook = `
${MARKER}
# Fixes an @react-native-firebase/app bug where its embed script also
# embeds CocoaPods framework artifacts (ExpoAsset, Pods_<target>), which
# App Store validation rejects. Safe to remove once fixed upstream.
post_integrate do |installer|
  system('node', File.join(__dir__, '..', 'scripts', 'fix-rnfb-embed-frameworks.js'))
end
`;

    config.modResults.contents = `${contents}\n${hook}`;
    return config;
  });
}

module.exports = withFixRnfbEmbedFrameworks;
