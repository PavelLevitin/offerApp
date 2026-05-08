/**
 * OTPPage
 *
 * OTP verification screen shown after phone number entry.
 * React Native app — elements use accessibility IDs (content-desc) and hints.
 *
 * Key elements:
 *   - title          — "קוד אימות" heading
 *   - otpInput       — 6-digit OTP input field
 *   - continueButton — "המשך" button
 *   - resendLink     — "שלח שוב" / resend code link (disabled during countdown)
 */
class OTPPage {

  get title() {
    return $('//*[contains(@content-desc, "מה הקוד שקיבלתם?")]');
  }

  get otpInput() {
    return $('//android.widget.EditText[@hint="pin_code_input"]');
  }

  get continueButton() {
    return $('~המשך');
  }

  get resendLink() {
    return $('//*[contains(@content-desc, "לא קיבלתי, תשלחו שוב")]');
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async waitForScreen() {
    await this.otpInput.waitForDisplayed({ timeout: 15000 });
  }

  async enterOTP(otp) {
    const el = await $('//android.widget.EditText[@clickable="true"]');
    await el.waitForDisplayed({ timeout: 10000 });
    await driver.execute('mobile: replaceElementValue', { elementId: el.elementId, text: '' });
    await driver.pause(200);
    await el.click();
    await driver.pause(200);
    await driver.keys(otp.split(''));
    await driver.pause(300);
  }

  async tapContinue() {
    await this.continueButton.waitForDisplayed({ timeout: 5000 });
    await this.continueButton.click();
    await driver.pause(1000);
  }

}

module.exports = new OTPPage();
