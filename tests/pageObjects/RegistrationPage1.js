/**
 * RegistrationPage1
 *
 * "הצטרפות למועדון" — registration form (step 1 of onboarding after OTP).
 * React Native app — no resource-ids; elements use accessibility IDs and hints.
 *
 * Key elements:
 *   - firstNameInput  hint="שם פרטי"
 *   - lastNameInput   hint="שם משפחה"
 *   - emailInput      hint contains "דוא" or "מייל"
 *   - gender chips    — גבר | אישה | אחר (clickable buttons)
 *   - mall picker     — dropdown / list for mall selection
 *   - terms checkbox  — T&C acceptance
 *   - tapContinue     — "המשך" button
 *
 * Validation error messages:
 *   - Short name:  "שם קצת קצר, לא?"
 *   - Missing field: "היי, שכחת אותי"
 *   - Bad email:   'כתובת הדוא"ל אינה תקינה'
 *   - Terms:       "יש לאשר"
 */
class RegistrationPage1 {

  /** Set by selectFirstMall() — the display name of the selected mall. */
  selectedMallName = '';

  get title() {
    return $('//*[contains(@content-desc, "הצטרפות למועדון") or contains(@text, "הצטרפות למועדון")]');
  }

  get firstNameInput() {
    return $('//*[@hint="שם פרטי"]');
  }

  get lastNameInput() {
    return $('//*[@hint="שם משפחה"]');
  }

  get emailInput() {
    return $('//*[contains(@hint, "דוא") or contains(@hint, "מייל") or contains(@hint, "אימייל")]');
  }

  get termsCheckbox() {
    return $('//*[contains(@content-desc, "תקנון") or contains(@content-desc, "תנאי שימוש") or contains(@content-desc, "terms")]');
  }

  get continueButton() {
    return $('~המשך');
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async waitForScreen() {
    await this.firstNameInput.waitForDisplayed({ timeout: 15000 });
  }

  async assertScreenVisible() {
    await expect(this.firstNameInput).toBeDisplayed();
    await expect(this.continueButton).toBeDisplayed();
  }

  async fillFirstName(name, _p2, _p3) {
    const el = await $('//android.widget.EditText[@hint="שם פרטי"]/android.widget.EditText[@clickable="true"]');
    await el.waitForDisplayed({ timeout: 10000 });
    await driver.execute('mobile: replaceElementValue', { elementId: el.elementId, text: '' });
    await driver.pause(200);
    await el.click();
    await driver.pause(200);
    await driver.keys(name.split(''));
    await driver.pause(300);
  }

  async fillLastName(name, _p2) {
    const el = await $('//android.widget.EditText[@hint="שם משפחה"]/android.widget.EditText[@clickable="true"]');
    await el.waitForDisplayed({ timeout: 10000 });
    await driver.execute('mobile: replaceElementValue', { elementId: el.elementId, text: '' });
    await driver.pause(200);
    await el.click();
    await driver.pause(200);
    await driver.keys(name.split(''));
    await driver.pause(300);
  }

  async fillEmail(email, scrollIntoView = false, _p3) {
    if (scrollIntoView) {
      await driver.action('pointer', { type: 'pointer', id: 'finger1', parameters: { pointerType: 'touch' } })
        .move({ duration: 0, x: 540, y: 1400 })
        .down({ button: 0 })
        .move({ duration: 600, x: 540, y: 700 })
        .up({ button: 0 })
        .perform();
      await driver.pause(300);
    }
    const el = await $('//android.widget.EditText[contains(@hint, "דוא") or contains(@hint, "מייל") or contains(@hint, "אימייל")]/android.widget.EditText[@clickable="true"]');
    await el.waitForDisplayed({ timeout: 10000 });
    await driver.execute('mobile: replaceElementValue', { elementId: el.elementId, text: '' });
    await driver.pause(200);
    await el.click();
    await driver.pause(200);
    await driver.keys(email.split(''));
    await driver.pause(300);
  }

  async selectGender(gender) {
    try { await driver.hideKeyboard(); } catch (_) {}
    await driver.pause(500);
    const genderButton = $('//*[contains(@content-desc, "מגדר") and @clickable="true"]');
    await genderButton.waitForDisplayed({ timeout: 5000 });
    await genderButton.click();
    await driver.pause(500);
    const option = $(`//*[@content-desc="${gender}" and @clickable="true"]`);
    await option.waitForDisplayed({ timeout: 5000 });
    await option.click();
    await driver.pause(300);
  }

  async selectFirstMall() {
    const mallButton = $('//*[contains(@content-desc, "קניון מועדף") and @clickable="true"]');
    await mallButton.waitForDisplayed({ timeout: 5000 });
    await mallButton.click();
    await driver.pause(1000);

    const firstMall = $('(//android.widget.Button[@clickable="true" and not(contains(@content-desc, "קניון מועדף"))])[1]');
    await firstMall.waitForDisplayed({ timeout: 10000 });
    const mallDesc = await firstMall.getAttribute('content-desc');
    this.selectedMallName = mallDesc ? mallDesc.split('\n')[0].trim() : '';
    await firstMall.click();
    await driver.pause(500);
  }

  async toggleTerms() {
    await this.termsCheckbox.waitForDisplayed({ timeout: 5000 });
    await this.termsCheckbox.click();
    await driver.pause(300);
  }

  async tapContinue() {
    await this.continueButton.click();
    await driver.pause(1000);
  }

}

module.exports = new RegistrationPage1();
