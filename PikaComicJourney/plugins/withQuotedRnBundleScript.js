const { withXcodeProject } = require('@expo/config-plugins');

// Expo's "Bundle React Native code and images" build phase runs the
// react-native-xcode.sh path via unquoted backticks, so the shell word-splits
// it when the project path contains a space (e.g. "Project 2026") and the
// phase fails with "/Users/.../Project: No such file or directory".
// Rewrite that line to store the path in a variable and invoke it quoted.
const PHASE_NAME = 'Bundle React Native code and images';
const UNQUOTED =
  /`(\\"\$NODE_BINARY\\" --print \\"require\('path'\)\.dirname\(require\.resolve\('react-native\/package\.json'\)\) \+ '\/scripts\/react-native-xcode\.sh'\\")`/;

function withQuotedRnBundleScript(config) {
  return withXcodeProject(config, (config) => {
    const phases = config.modResults.hash.project.objects.PBXShellScriptBuildPhase || {};

    for (const phase of Object.values(phases)) {
      if (typeof phase !== 'object' || !phase.name || !phase.name.includes(PHASE_NAME)) {
        continue;
      }
      phase.shellScript = phase.shellScript.replace(
        UNQUOTED,
        'REACT_NATIVE_XCODE=\\"$($1)\\"\\nbash \\"$REACT_NATIVE_XCODE\\"'
      );
    }

    return config;
  });
}

module.exports = withQuotedRnBundleScript;
