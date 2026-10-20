const { withPodfile } = require('@expo/config-plugins');

// expo-constants' "Generate app.config for prebuilt Constants.manifest" pod
// script runs `bash -l -c "$PODS_TARGET_SRCROOT/../scripts/get-app-config-ios.sh"`
// without inner quotes, so bash word-splits the path when the project path
// contains a space (e.g. "Project 2026") and the build fails with
// "bash: /Users/.../Project: No such file or directory".
// Re-quote the script path inside `bash -c` for every pod script phase.
const MARKER = '# --- withQuotedPodScriptPaths ---';
const ANCHOR = ':ccache_enabled => ccache_enabled?(podfile_properties),\n    )\n';

function withQuotedPodScriptPaths(config) {
  return withPodfile(config, (config) => {
    const contents = config.modResults.contents;

    if (contents.includes(MARKER)) {
      return config;
    }
    if (!contents.includes(ANCHOR)) {
      throw new Error('withQuotedPodScriptPaths: react_native_post_install call not found in Podfile');
    }

    const hook = `
    ${MARKER}
    installer.pods_project.targets.each do |target|
      target.shell_script_build_phases.each do |phase|
        script = phase.shell_script
        quoted = script.gsub(/bash -l -c "(\\$PODS_TARGET_SRCROOT\\/[^"]+)"/) { "bash -l -c \\"\\\\\\"#{$1}\\\\\\"\\"" }
        phase.shell_script = quoted if quoted != script
      end
    end
`;

    config.modResults.contents = contents.replace(ANCHOR, `${ANCHOR}${hook}`);
    return config;
  });
}

module.exports = withQuotedPodScriptPaths;
