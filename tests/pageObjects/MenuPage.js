/**
 * MenuPage
 *
 * Side-drawer menu opened by tapping ~menu_icon_button on the Home screen.
 * React Native app — elements use accessibility IDs (content-desc).
 *
 * Key elements:
 *   - Login / Register button  — visible when not logged in
 *   - My Account button        — visible when logged in
 */
class MenuPage {

  get backButton() {
    return $('//*[@content-desc="Back" or @content-desc="back_icon_button"]');
  }

  get loginRegisterButton() {
    return $('//*[contains(@content-desc, "כניסה") or contains(@content-desc, "הרשמה") or contains(@text, "כניסה")]');
  }

  get myAccountButton() {
    return $('//*[contains(@content-desc, "האזור האישי") or contains(@content-desc, "חשבון") or contains(@text, "האזור האישי")]');
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async waitForScreen() {
    await this.loginRegisterButton.waitForDisplayed({ timeout: 10000 })
      .catch(() => this.myAccountButton.waitForDisplayed({ timeout: 5000 }));
  }

  async tapLoginOrRegister() {
    await this.loginRegisterButton.waitForDisplayed({ timeout: 10000 });
    await this.loginRegisterButton.click();
    await driver.pause(500);
  }

  async tapMyAccount() {
    await this.myAccountButton.waitForDisplayed({ timeout: 10000 });
    await this.myAccountButton.click();
    await driver.pause(500);
  }

}

module.exports = new MenuPage();
