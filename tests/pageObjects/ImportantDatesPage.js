/**
 * ImportantDatesPage
 *
 * "הצטרפות למועדון" — important dates screen (step 2 of registration).
 * React Native app — no resource-ids; elements use accessibility IDs (content-desc).
 *
 * Key elements:
 *   - Back button              (~back_icon_button)
 *   - Birthday picker          hint="יום הולדת"   — clickable=false, tap by coords (540,1115)
 *   - Wedding anniversary      hint="יום נישואין"  — optional
 *   - Remove family member     (~remove_family_member_button)   — optional
 *   - Family member DOB        hint="תאריך לידה"  — optional
 *   - Family member name       hint="שם מלא"      — optional
 *   - Add family member        (~add_family_member_button)      — optional
 *   - Continue button          (~המשך)
 *
 * IMPORTANT — selector notes:
 *   - Birthday / anniversary / DOB fields use @hint, NOT content-desc
 *   - Birthday field is clickable=false — must tap by coordinates (540, 1115)
 *   - Continue button uses content-desc="המשך"
 *
 * Validation notes (for future validation tests):
 *   - Birthday (יום הולדת) is mandatory — "המשך" is disabled until selected
 *   - Tapping "יום הולדת" opens a date picker (Android DatePickerDialog)
 *   - Birthday must be > 18 years ago (max year = current year - 18)
 *   - Date picker: tap field (clickGesture) → tap "Select year" → UiScrollable to year → tap OK
 *   - Wedding anniversary, family member fields are all optional
 */
const { typeText } = require('../helpers/typeText');
const { faker }    = require('@faker-js/faker');

class ImportantDatesPage {

  get backButton() {
    return $('~back_icon_button');
  }

  get birthdayPicker() {
    return $('//*[contains(@hint, "יום הולדת")]');
  }

  get weddingAnniversaryPicker() {
    return $('//*[contains(@hint, "יום נישואין")]');
  }

  get removeFamilyMember() {
    return $('~remove_family_member_button');
  }

  get familyMemberDOB() {
    return $('//*[contains(@hint, "תאריך לידה")]');
  }

  get familyMemberName() {
    return $('//*[@hint="שם מלא"]');
  }

  get addFamilyMember() {
    return $('~add_family_member_button');
  }

  get continueButton() {
    return $('~המשך');
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  async waitForScreen() {
    await this.continueButton.waitForDisplayed({ timeout: 15000 });
  }

  async assertScreenVisible() {
    await expect(this.birthdayPicker).toBeDisplayed();
    await expect(this.continueButton).toBeDisplayed();
  }

  /**
   * selectBirthday — picks a date in the Android DatePickerDialog.
   *
   * Birthday field is clickable=false — must tap via mobile: clickGesture.
   * Field bounds: [120,1028][960,1202] → center ≈ (540, 1115)
   *
   * How the picker works:
   *   - Opens with current date selected (today's date)
   *   - Tap the "March 20xx ▼" header → switches to scrollable year grid (3 columns)
   *   - Year buttons use content-desc (e.g. "1990"), not text
   *   - UiScrollable scrolls to the target year reliably regardless of position
   *   - After year tap, month/day is preserved — tap OK to confirm
   *
   * Default: 28/03/1990 — always valid (>18 years).
   */
  async selectBirthday(year = '1990') {
    // Field is clickable=false — compute center from element bounds and use clickGesture
    await this.birthdayPicker.waitForDisplayed({ timeout: 10000 });
    const loc  = await this.birthdayPicker.getLocation();
    const size = await this.birthdayPicker.getSize();
    const x = Math.round(loc.x + size.width / 2);
    const y = Math.round(loc.y + size.height / 2);
    await driver.execute('mobile: clickGesture', { x, y });
    await driver.pause(500);

    // Open year grid
    await $('//*[contains(@content-desc, "Select year")]').click();
    await driver.pause(300);

    // Scroll year list to the target year and tap it
    const yearEl = await $(
      `-android uiautomator:new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().description("${year}"))`
    );
    await yearEl.click();
    await driver.pause(300);

    // Confirm
    await $('~OK').click();
    await driver.pause(500);
  }

  async selectWeddingAnniversary(year = '2025') {
    await this.weddingAnniversaryPicker.waitForDisplayed({ timeout: 10000 });
    const loc  = await this.weddingAnniversaryPicker.getLocation();
    const size = await this.weddingAnniversaryPicker.getSize();
    const x = Math.round(loc.x + size.width / 2);
    const y = Math.round(loc.y + size.height / 2);
    await driver.execute('mobile: clickGesture', { x, y });
    await driver.pause(500);

    await $('//*[contains(@content-desc, "Select year")]').click();
    await driver.pause(300);

    const yearEl = await $(
      `-android uiautomator:new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().description("${year}"))`
    );
    await yearEl.click();
    await driver.pause(300);

    await $('~OK').click();
    await driver.pause(500);
  }

  async scrollUp() {
    await driver.action('pointer', {
      type: 'pointer', id: 'finger1',
      parameters: { pointerType: 'touch' },
    })
      .move({ duration: 0, x: 540, y: 500 })
      .down({ button: 0 })
      .move({ duration: 300, x: 540, y: 1400 })
      .up({ button: 0 })
      .perform();
    await driver.pause(300);
  }

  async scrollDown() {
    await driver.action('pointer', {
      type: 'pointer', id: 'finger1',
      parameters: { pointerType: 'touch' },
    })
      .move({ duration: 0, x: 540, y: 1400 })
      .down({ button: 0 })
      .move({ duration: 300, x: 540, y: 500 })
      .up({ button: 0 })
      .perform();
    await driver.pause(300);
  }

  /**
   * Fill the name and DOB for the current (last) family member row.
   * Scrolls up after keyboard appears for the name field.
   * Year must be <= current year - 5 (e.g. 2020).
   */
  async fillFamilyMember(name, year) {
    // Click the last clickable שם מלא inner input
    const nameInputs = await $$('//*[@hint="שם מלא" and @clickable="true"]');
    const nameInput = nameInputs[nameInputs.length - 1];
    await nameInput.click();
    await driver.pause(300);
    await this.scrollDown(); // scroll down after keyboard pops to see the input
    await typeText(name);
    try { await driver.hideKeyboard(); } catch (_) {}
    await driver.pause(300);
    await this.scrollDown(); // bring DOB field into view after keyboard dismissed

    // Tap last תאריך לידה field by center coords (clickable=false)
    const dobFields = await $$('//*[contains(@hint, "תאריך לידה")]');
    const dobField = dobFields[dobFields.length - 1];
    const loc  = await dobField.getLocation();
    const size = await dobField.getSize();
    const x = Math.round(loc.x + size.width / 2);
    const y = Math.round(loc.y + size.height / 2);
    await driver.execute('mobile: clickGesture', { x, y });
    await driver.pause(500);
    await $('//*[contains(@content-desc, "Select year")]').click();
    await driver.pause(300);
    const yearEl = await $(
      `-android uiautomator:new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().description("${year}"))`
    );
    await yearEl.click();
    await driver.pause(300);
    await $('~OK').click();
    await driver.pause(500);
  }

  /**
   * Tap the "+" button to add a new family member row, then scroll up.
   */
  async tapAddMember() {
    await this.scrollDown(); // "+" gets pushed below fold as list grows
    await this.addFamilyMember.waitForDisplayed({ timeout: 5000 });
    await this.addFamilyMember.click();
    await driver.pause(500);
  }

  async tapContinue() {
    await this.continueButton.click();
    await driver.pause(1000);
  }

}

module.exports = new ImportantDatesPage();
