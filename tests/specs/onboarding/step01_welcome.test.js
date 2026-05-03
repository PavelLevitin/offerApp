const WelcomePage = require('../../pageObjects/WelcomePage');
const { goToWelcomeScreen } = require('./helpers');

describe('Fresh Onboarding — Step 1: Welcome screen', () => {
  before(async () => {
    await goToWelcomeScreen();
  });

  it('should display the Welcome screen', async () => {
    await WelcomePage.assertWelcomeScreenVisible();
  });

  it('should display all region tabs', async () => {
    await WelcomePage.assertAllRegionTabsVisible();
  });
});
