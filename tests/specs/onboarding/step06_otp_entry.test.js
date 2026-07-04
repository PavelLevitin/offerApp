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

  it('should display the OTP screen title', async () => {
    await expect(OTPPage.title).toBeDisplayed();
  });

  it('should display the OTP input field', async () => {
    await expect(OTPPage.otpInput).toBeDisplayed();
  });

  it('should display the continue button', async () => {
    await expect(OTPPage.continueButton).toBeDisplayed();
  });

  it('should display the resend link and eventually enable it', async () => {
    await expect(OTPPage.resendLink).toBeDisplayed();
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
