const OTPPage        = require('../../pageObjects/OTPPage');
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
  });

  it('should show error for wrong phone prefix', async () => {
    await PhoneEntryPage.enterPhone('0312345678');
    await PhoneEntryPage.sendCodeButton.click();
    const prefixError = $('//*[contains(@content-desc, "מספר טלפון לא תקין") or contains(@text, "מספר טלפון לא תקין")]');
    await prefixError.waitForDisplayed({ timeout: 3000 });
    await expect(prefixError).toBeDisplayed();
  });

  it('should enable CTA for valid phone number', async () => {
    await PhoneEntryPage.enterPhone(testData.credentials.testPhone);
    await expect(PhoneEntryPage.sendCodeButton).toBeEnabled();
  });

  it('should navigate to OTP screen and display all OTP fields', async () => {
    await PhoneEntryPage.tapSendCode();
    await OTPPage.waitForScreen();
    await expect(OTPPage.title).toBeDisplayed();
    await expect(OTPPage.otpInput).toBeDisplayed();
    await expect(OTPPage.continueButton).toBeDisplayed();
  });
});
