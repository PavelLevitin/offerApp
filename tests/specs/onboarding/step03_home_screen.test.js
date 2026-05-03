const HomePage = require('../../pageObjects/HomePage');
const { goToWelcomeScreen, goThroughMallSelection } = require('./helpers');

describe('Fresh Onboarding — Step 3: Home screen', () => {
  before(async () => {
    await goToWelcomeScreen();
    await goThroughMallSelection();
  });

  it('should display the Home screen content', async () => {
    await HomePage.assertHomeScreenVisible();
  });

  it('should display the bottom navigation bar', async () => {
    await HomePage.assertBottomNavVisible();
  });

  it('should display the top bar with menu and search', async () => {
    await HomePage.assertTopBarVisible();
  });
});
