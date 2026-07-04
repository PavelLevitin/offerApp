/**
 * DeleteAccountPage
 *
 * Account deletion confirmation screen.
 * React Native app — elements use accessibility IDs (content-desc).
 *
 * Key elements:
 *   - continueButton     — confirm delete button
 *   - successDialog      — success message after deletion
 *   - goHomeButton       — navigate back to Home after deletion
 */
class DeleteAccountPage {

  get continueButton() {
    return $('//*[contains(@content-desc, "אישור") or contains(@content-desc, "מחק") or contains(@content-desc, "המשך") and @clickable="true"]');
  }

  get successDialog() {
    return $('//*[contains(@content-desc, "החשבון נמחק") or contains(@content-desc, "נמחק בהצלחה") or contains(@text, "נמחק")]');
  }

  get goHomeButton() {
    return $('//*[contains(@content-desc, "לדף הבית") or contains(@content-desc, "חזור") or contains(@content-desc, "go_home") or contains(@text, "לדף הבית")]');
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async waitForScreen() {
    await this.continueButton.waitForDisplayed({ timeout: 15000 });
  }

  async tapContinue() {
    await this.continueButton.waitForDisplayed({ timeout: 10000 });
    await this.continueButton.click();
    await driver.pause(1000);
  }

  async waitForSuccessDialog() {
    await this.successDialog.waitForDisplayed({ timeout: 15000 });
  }

  async tapGoHome() {
    await this.goHomeButton.waitForDisplayed({ timeout: 10000 });
    await this.goHomeButton.click();
    await driver.pause(1500);
  }

}

module.exports = new DeleteAccountPage();
