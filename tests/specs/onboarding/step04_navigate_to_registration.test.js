const HomePage        = require('../../pageObjects/HomePage');
const MenuPage        = require('../../pageObjects/MenuPage');
const PhoneEntryPage  = require('../../pageObjects/PhoneEntryPage');
const { goToWelcomeScreen, goThroughMallSelection } = require('./helpers');

describe('Fresh Onboarding — Step 4: Navigate to registration', () => {
  before(async () => {
    await goToWelcomeScreen();
    await goThroughMallSelection();
    await HomePage.menuButton.click();
    await MenuPage.waitForScreen();
    await MenuPage.tapLoginOrRegister();
    await PhoneEntryPage.waitForScreen();
  });

  it('should display the phone entry title', async () => {
    const title = $('//*[contains(@content-desc, "מה מספר הנייד שלכם?") or contains(@text, "מה מספר הנייד שלכם?")]');
    await expect(title).toBeDisplayed();
  });

  it('should display the phone input field', async () => {
    await expect(PhoneEntryPage.phoneInput).toBeDisplayed();
  });

  it('should display the send code button', async () => {
    await expect(PhoneEntryPage.sendCodeButton).toBeDisplayed();
  });
});
