const { config: baseConfig } = require('./wdio.conf');

/**
 * Fresh Install Config
 *
 * Runs only the fresh-start specs (first-ever app launch flow).
 * Uninstalls and reinstalls the app before the session starts.
 *
 * Usage:
 *   npx wdio wdio.fresh.conf.js
 */
exports.config = {
  ...baseConfig,

  specs: [
    './tests/specs/freshStart.test.js',
    './tests/specs/locationPermission.test.js',
  ],
  exclude: [],

  capabilities: [
    {
      ...baseConfig.capabilities[0],
      'appium:fullReset':          true,   // uninstall + reinstall the app
      'appium:noReset':            false,
      'appium:autoGrantPermissions': true,
      'appium:appWaitForLaunch':   false,  // don't hang if system permission dialog steals focus on first launch
    },
  ],

  onComplete: baseConfig.onComplete,
};
