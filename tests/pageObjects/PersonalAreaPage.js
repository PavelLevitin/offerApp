/**
 * PersonalAreaPage
 *
 * "האזור האישי" — personal area screen with tabs.
 * React Native app — elements use accessibility IDs (content-desc).
 *
 * Key elements:
 *   - personalDetailsTab  — "פרטים אישיים" tab
 *   - interestsTab        — "תחומי עניין" tab
 *   - importantDatesTab   — "תאריכים חשובים" tab
 *   - mailingTab          — "דיוור" tab
 *   - saveButton          — "שמור" button
 *   - successToast        — success message after save
 *   - genderButton        — gender selector
 */
class PersonalAreaPage {

  get personalDetailsTab() {
    return $('//*[contains(@content-desc, "פרטים אישיים")]');
  }

  get interestsTab() {
    return $('//*[contains(@content-desc, "תחומי עניין") or contains(@content-desc, "תחומים")]');
  }

  get importantDatesTab() {
    return $('//*[contains(@content-desc, "תאריכים חשובים") or contains(@content-desc, "תאריכים")]');
  }

  get mailingTab() {
    return $('//*[contains(@content-desc, "דיוור")]');
  }

  get saveButton() {
    return $('//*[contains(@content-desc, "שמור") or contains(@text, "שמור")]');
  }

  get successToast() {
    return $('//*[contains(@content-desc, "השינויים נשמרו") or contains(@content-desc, "נשמר") or contains(@text, "נשמר")]');
  }

  get genderButton() {
    return $('//*[contains(@content-desc, "מין") or contains(@content-desc, "gender_selector")]');
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async waitForScreen() {
    await this.personalDetailsTab.waitForDisplayed({ timeout: 15000 });
  }

  async scrollUp() {
    const { width, height } = await driver.getWindowSize();
    const cx = Math.round(width / 2);
    await driver.action('pointer', {
      type: 'pointer', id: 'finger1',
      parameters: { pointerType: 'touch' },
    })
      .move({ duration: 0, x: cx, y: Math.round(height * 0.25) })
      .down({ button: 0 })
      .move({ duration: 300, x: cx, y: Math.round(height * 0.75) })
      .up({ button: 0 })
      .perform();
    await driver.pause(300);
  }

  async scrollDown() {
    const { width, height } = await driver.getWindowSize();
    const cx = Math.round(width / 2);
    await driver.action('pointer', {
      type: 'pointer', id: 'finger1',
      parameters: { pointerType: 'touch' },
    })
      .move({ duration: 0, x: cx, y: Math.round(height * 0.75) })
      .down({ button: 0 })
      .move({ duration: 300, x: cx, y: Math.round(height * 0.25) })
      .up({ button: 0 })
      .perform();
    await driver.pause(300);
  }

  /**
   * Scrolls to and taps the delete account button within the mailing tab.
   */
  async navigateToDeleteAccount() {
    const deleteBtn = await $(`-android uiautomator:new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().descriptionContains("מחק חשבון"))`);
    await deleteBtn.waitForDisplayed({ timeout: 10000 });
    await deleteBtn.click();
    await driver.pause(1000);
  }

}

module.exports = new PersonalAreaPage();
