const PhoneEntryPage = require('../../pageObjects/PhoneEntryPage');
const testData       = require('../../data/testData');
const { goToWelcomeScreen, goThroughMallSelection, navigateToPhoneEntry } = require('./helpers');

describe('Fresh Onboarding — Step 5: Phone entry validations', () => {
  before(async () => {
    await goToWelcomeScreen();
    await goThroughMallSelection();
    await navigateToPhoneEntry();
  });

  it('should have CTA disabled before any input', async () => {
    await expect(PhoneEntryPage.sendCodeButton).not.toBeEnabled();
  });

  it('should keep CTA disabled for too-short phone number', async () => {
    await PhoneEntryPage.enterPhone('05012345');
    await expect(PhoneEntryPage.sendCodeButton).not.toBeEnabled();
    await PhoneEntryPage.clearPhone();
  });

  it('should show error for wrong phone prefix', async () => {
    await PhoneEntryPage.enterPhone('0312345678');
    await PhoneEntryPage.sendCodeButton.click();
    const prefixError = $('//*[contains(@content-desc, "מספר טלפון לא תקין") or contains(@text, "מספר טלפון לא תקין")]');
    await prefixError.waitForDisplayed({ timeout: 3000 });
    await expect(prefixError).toBeDisplayed();
    await PhoneEntryPage.clearPhone();
  });

  it('should enable CTA for valid phone number', async () => {
    await PhoneEntryPage.enterPhone(testData.credentials.testPhone);
    await expect(PhoneEntryPage.sendCodeButton).toBeEnabled();
  });
});
