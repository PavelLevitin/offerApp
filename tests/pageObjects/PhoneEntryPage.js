/**
 * PhoneEntryPage
 *
 * "מה מספר הנייד שלכם?" — phone number entry screen.
 * React Native app — elements use accessibility IDs (content-desc) and hints.
 *
 * Key elements:
 *   - phoneInput     — hint contains "טלפון"
 *   - sendCodeButton — content-desc contains "שלח קוד"
 */
class PhoneEntryPage {

  get phoneInput() {
    // The outer EditText has hint but text="" — target the inner clickable one which holds the actual text
    return $('//android.widget.EditText[@clickable="true"]');
  }

  get sendCodeButton() {
    return $('//*[contains(@content-desc, "שלחו לי קוד") or contains(@text, "שלחו לי קוד")]');
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async waitForScreen() {
    await this.phoneInput.waitForDisplayed({ timeout: 15000 });
  }

  async clearPhone() {
    const el = await $('//android.widget.EditText[@clickable="true"]');
    await driver.execute('mobile: replaceElementValue', { elementId: el.elementId, text: '' });
    await driver.pause(200);
  }

  async enterPhone(phone) {
    const el = await $('//android.widget.EditText[@clickable="true"]');
    await el.waitForDisplayed({ timeout: 10000 });
    await driver.execute('mobile: replaceElementValue', { elementId: el.elementId, text: '' });
    await driver.pause(200);
    await el.click();
    await driver.pause(200);
    await driver.keys(phone.split(''));
    await driver.pause(300);
  }

  async tapSendCode() {
    await this.sendCodeButton.waitForDisplayed({ timeout: 5000 });
    await this.sendCodeButton.click();
    await driver.pause(1000);
  }

}

module.exports = new PhoneEntryPage();
