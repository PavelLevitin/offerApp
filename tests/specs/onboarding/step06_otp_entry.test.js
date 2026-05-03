const OTPPage          = require('../../pageObjects/OTPPage');
const RegistrationPage1 = require('../../pageObjects/RegistrationPage1');
const testData         = require('../../data/testData');
const { clearField }   = require('../../helpers/typeText');
const {
  goToWelcomeScreen,
  goThroughMallSelection,
  navigateToPhoneEntry,
  submitPhone,
} = require('./helpers');

describe('Fresh Onboarding — Step 6: OTP entry validations', () => {
  before(async () => {
    await goToWelcomeScreen();
    await goThroughMallSelection();
    await navigateToPhoneEntry();
    await submitPhone();
  });

  it('should display the OTP screen with all elements', async () => {
    await expect(OTPPage.title).toBeDisplayed();
    await expect(OTPPage.otpInput).toBeDisplayed();
    await expect(OTPPage.continueButton).toBeDisplayed();
  });

  it('should show countdown and have resend link disabled then enabled', async () => {
    const countdownText = $('//*[contains(@content-desc, "אפשר לקבל קוד חדש בעוד") or contains(@text, "אפשר לקבל קוד חדש בעוד")]');
    await expect(countdownText).toBeDisplayed();
    await expect(OTPPage.resendLink).toBeDisplayed();
    await expect(OTPPage.resendLink).not.toBeEnabled();
    await OTPPage.resendLink.waitForEnabled({ timeout: 50000 });
  });

  it('should show error for wrong OTP', async () => {
    await OTPPage.enterOTP('000000');
    await OTPPage.tapContinue();
    const otpError = $('//*[contains(@content-desc, "קוד") or contains(@text, "קוד")][@clickable="false"]');
    await otpError.waitForDisplayed({ timeout: 5000 });
    await expect(otpError).toBeDisplayed();
    await OTPPage.otpInput.click();
    await clearField(6);
  });

  it('should navigate to Registration form with correct OTP', async () => {
    await OTPPage.enterOTP(testData.credentials.testOtp);
    await OTPPage.tapContinue();
    await RegistrationPage1.waitForScreen();
    await expect(RegistrationPage1.title).toBeDisplayed();
    await expect(RegistrationPage1.firstNameInput).toBeDisplayed();
  });
});
