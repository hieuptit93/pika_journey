const { withPodfile } = require('@expo/config-plugins');

// Xcode 27 only accepts iOS deployment targets >= 15.0 and fails the build
// otherwise. Some pod targets still pin an old one in their podspec
// (RNCAsyncStorage_resources at 12.4, RNSVGFilters at 13.4), so raise every
// pod target that is below the app's own minimum up to it.
const MARKER = '# --- withPodsMinDeploymentTarget ---';
const ANCHOR = ':ccache_enabled => ccache_enabled?(podfile_properties),\n    )\n';

function withPodsMinDeploymentTarget(config) {
  return withPodfile(config, (config) => {
    const contents = config.modResults.contents;

    if (contents.includes(MARKER)) {
      return config;
    }
    if (!contents.includes(ANCHOR)) {
      throw new Error('withPodsMinDeploymentTarget: react_native_post_install call not found in Podfile');
    }

    const hook = `
    ${MARKER}
    min_target = podfile_properties['ios.deploymentTarget'] || '16.4'
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |build_config|
        current = build_config.build_settings['IPHONEOS_DEPLOYMENT_TARGET']
        if current && Gem::Version.new(current) < Gem::Version.new(min_target)
          build_config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = min_target
        end
      end
    end
`;

    config.modResults.contents = contents.replace(ANCHOR, `${ANCHOR}${hook}`);
    return config;
  });
}

module.exports = withPodsMinDeploymentTarget;
