const WelcomePage = require('../../pageObjects/WelcomePage');
const HomePage    = require('../../pageObjects/HomePage');
const { goToWelcomeScreen } = require('./helpers');

describe('Fresh Onboarding — Step 2: Mall selection', () => {
  before(async () => {
    await goToWelcomeScreen();
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
