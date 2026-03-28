const WelcomePage = require('../pageObjects/WelcomePage');
const HomePage    = require('../pageObjects/HomePage');

/**
 * Fresh Start Flow
 *
 * Prerequisites: fresh install (wdio.fresh.conf.js — fullReset: true, autoGrantPermissions: true).
 * Covers the complete first-launch experience from app open to home screen.
 */
describe('Fresh Start Flow', () => {

  before(async () => {
    await driver.pause(3000); // let the app start
  });

  // ── Step 1: Welcome screen ──────────────────────────────────────────────

  describe('Welcome screen', () => {

    before(async () => {
      await WelcomePage.waitForScreen();
    });

    it('should display the Welcome screen on first launch', async () => {
      await WelcomePage.assertWelcomeScreenVisible();
    });

    it('should display all three region tabs', async () => {
      await WelcomePage.assertAllRegionTabsVisible();
    });

  });

  // ── Step 2: Mall selection ──────────────────────────────────────────────

  describe('Mall selection', () => {

    it('should click the sort by location button', async () => {
      await WelcomePage.clickSortByLocation();
    });

    it('should display at least one mall in the list', async () => {
      await WelcomePage.assertMallListNotEmpty();
    });

    it('should navigate to Home screen after selecting a mall', async () => {
      await WelcomePage.selectFirstMall();
      await HomePage.waitForScreen();
    });

  });

  // ── Step 3: Home screen ─────────────────────────────────────────────────

  describe('Home screen after mall selection', () => {

    before(async () => {
      const isHome = await HomePage.menuButton.isDisplayed().catch(() => false);
      if (!isHome) {
        await WelcomePage.selectFirstMall();
        await HomePage.waitForScreen();
      }
    });

    it('should display the home screen content', async () => {
      await HomePage.assertHomeScreenVisible();
    });

    it('should display the bottom navigation bar', async () => {
      await HomePage.assertBottomNavVisible();
    });

    it('should display the top bar with menu and search', async () => {
      await HomePage.assertTopBarVisible();
    });

  });

});
