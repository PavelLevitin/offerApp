const path = require('path');
const { spawn, execSync } = require('child_process');

let appiumPid;

function killPort(port) {
  try {
    // Find and kill any process using the port on Windows
    const result = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
    const pids = [...new Set(
      result.split('\n')
        .map((line) => line.trim().split(/\s+/).pop())
        .filter((pid) => pid && /^\d+$/.test(pid) && pid !== '0')
    )];
    pids.forEach((pid) => {
      try { execSync(`taskkill /F /T /PID ${pid}`, { stdio: 'ignore' }); } catch (_) {}
    });
  } catch (_) {
    // port was already free
  }
}

exports.config = {
  runner: 'local',
  port: 4723,
  specs: ['./tests/specs/**/*.test.js'],
  exclude: [
    './tests/specs/freshStart.test.js',
    './tests/specs/locationPermission.test.js',
  ],
  maxInstances: 1,
  framework: 'mocha',
  reporters: [
    'spec',
    ['allure', {
      outputDir: './reports/allure-results',
      disableWebdriverStepsReporting: false,
      disableWebdriverScreenshotsReporting: false,
    }],
    ['video', {
      saveAllVideos: false,       // only save video for failed tests
      videoSlowdownMultiplier: 3,
      outputDir: './reports/videos',
    }],
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
    retries: 0,                   // no retries during debugging — stop on first failure
  },
  capabilities: [
    {
      platformName: 'Android',
      'appium:deviceName': 'Samsung S22',
      'appium:udid': 'R5CTA20GX1M',
      'appium:app': path.resolve(__dirname, './app-stage-release.apk'),
      'appium:automationName': 'UiAutomator2',
      'appium:appWaitForLaunch': true,
      'appium:newCommandTimeout': 240,
      'appium:noReset': false,
      'appium:fullReset': false,
      'appium:autoGrantPermissions': false,
    },
  ],
  services: [],
  logLevel: 'info',
  bail: 1,                      // stop the suite after the first test failure
  waitforTimeout: 15000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  /**
   * Grant location permissions via ADB after the session starts.
   * autoGrantPermissions: true does not work reliably on Samsung One UI (Android 12+),
   * so we grant them explicitly here instead.
   */
  before: async function () {
    const { execSync } = require('child_process');
    const deviceId = 'R5CTA20GX1M';
    const pkg      = 'com.ofermalls.myofer.stage';
    const perms    = [
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
    ];
    for (const perm of perms) {
      try {
        execSync(`adb -s ${deviceId} shell pm grant ${pkg} ${perm}`, { stdio: 'ignore' });
      } catch (_) {
        console.warn(`Could not grant ${perm} — dialog may still appear`);
      }
    }
  },

  /**
   * Take a screenshot on test failure and attach it to the Allure report.
   */
  afterTest: async function (test, context, { error }) {
    if (error) {
      const fs        = require('fs');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const testName  = test.title.replace(/\s+/g, '_');
      const screenshotPath = `./reports/screenshots/${testName}_${timestamp}.png`;

      await driver.saveScreenshot(screenshotPath);
      console.log(`\n📸 Screenshot saved: ${screenshotPath}`);

      // Attach screenshot to Allure report
      const screenshot = fs.readFileSync(screenshotPath);
      const allureReporter = require('@wdio/allure-reporter').default;
      allureReporter.addAttachment('Failure Screenshot', screenshot, 'image/png');
    }
  },

  onPrepare: async function () {
    console.log('Clearing port 4723...');
    killPort(4723);

    console.log('Starting Appium server...');
    const appiumScript = 'C:\\Users\\pavel\\AppData\\Roaming\\npm\\node_modules\\appium\\index.js';
    const appium = spawn(process.execPath, [appiumScript, '--port', '4723', '--relaxed-security'], {
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, NODE_OPTIONS: '' },
      windowsHide: true,
    });

    appiumPid = appium.pid;
    appium.stdout.on('data', (d) => process.stdout.write(d));
    appium.stderr.on('data', (d) => process.stderr.write(d));

    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Appium did not start in time')), 20000);
      appium.stdout.on('data', (data) => {
        if (data.toString().includes('listener started')) {
          clearTimeout(timeout);
          resolve();
        }
      });
      appium.on('exit', (code) => {
        clearTimeout(timeout);
        reject(new Error(`Appium exited unexpectedly with code ${code}`));
      });
    });

    console.log(`Appium server is ready (PID ${appiumPid}).`);
  },

  onComplete: function () {
    if (appiumPid) {
      console.log('Stopping Appium server...');
      try { execSync(`taskkill /F /T /PID ${appiumPid}`, { stdio: 'ignore' }); } catch (_) {}
    }
  },
};
