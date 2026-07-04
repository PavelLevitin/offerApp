const ImportantDatesPage   = require('../../pageObjects/ImportantDatesPage');
const CategoryAndShopsPage = require('../../pageObjects/CategoryAndShopsPage');
const testData             = require('../../data/testData');
const sessionData          = require('../../data/sessionData');
const { faker }            = require('@faker-js/faker');
const {
  goToWelcomeScreen,
  goThroughMallSelection,
  navigateToPhoneEntry,
  submitPhone,
  waitAndEnterOTP,
  completeRegistrationFormHappyPath,
  completeCategoriesHappyPath,
  deleteAccount,
} = require('./helpers');

describe('Fresh Onboarding — Steps 8–9: Important dates & Categories', () => {
  before(async () => {
    await goToWelcomeScreen();
    await goThroughMallSelection();
    await navigateToPhoneEntry();
    await submitPhone();
    await waitAndEnterOTP();
    await completeRegistrationFormHappyPath();
  });

  // ── Step 8: Important dates ──────────────────────────────────────────────

  it('should display the Important Dates screen', async () => {
    const header = $('//*[contains(@content-desc, "הצטרפות למועדון") or contains(@text, "הצטרפות למועדון")]');
    await expect(header).toBeDisplayed();
    await expect(ImportantDatesPage.birthdayPicker).toBeDisplayed();
    await expect(ImportantDatesPage.weddingAnniversaryPicker).toBeDisplayed();
    await expect(ImportantDatesPage.continueButton).toBeDisplayed();
    await ImportantDatesPage.assertScreenVisible();
  });

  it('should have CTA disabled before birthday is selected', async () => {
    const disabledCta = $('//*[@content-desc="המשך" and @enabled="false"]');
    await expect(disabledCta).toExist();
  });

  it('should show under-18 error and keep CTA disabled', async () => {
    await ImportantDatesPage.selectBirthday('2010');
    const ageError = $('//*[contains(@content-desc, "עליך להיות בן 18 לפחות כדי להירשם") or contains(@text, "עליך להיות בן 18 לפחות כדי להירשם")]');
    await ageError.waitForDisplayed({ timeout: 5000 });
    await expect(ageError).toBeDisplayed();
    await expect($('//*[@content-desc="המשך" and @enabled="false"]')).toExist();
  });

  it('should clear age error and enable CTA for valid birthday', async () => {
    await ImportantDatesPage.selectBirthday(testData.importantDates.birthYear);
    const ageError = $('//*[contains(@content-desc, "עליך להיות בן 18 לפחות כדי להירשם") or contains(@text, "עליך להיות בן 18 לפחות כדי להירשם")]');
    await expect(ageError).not.toBeDisplayed();
    await expect($('//*[@content-desc="המשך" and @enabled="true"]')).toExist();
  });

  it('should accept wedding anniversary selection', async () => {
    await ImportantDatesPage.selectWeddingAnniversary(testData.importantDates.anniversaryYear);
    const fieldText = await $('//*[contains(@hint, "יום נישואין")]').$('android.view.View').getAttribute('text');
    expect(fieldText).toContain('25');
    await expect($('//*[@content-desc="המשך" and @enabled="true"]')).toExist();
    sessionData.anniversaryYear = testData.importantDates.anniversaryYear;
  });

  it('should allow adding up to 4 family members', async () => {
    await $(`-android uiautomator:new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().description("add_family_member_button"))`);
    await driver.pause(500);
    for (let i = 0; i < 4; i++) {
      if (i > 0) await ImportantDatesPage.tapAddMember();
      const name = faker.person.firstName();
      const year = faker.number.int({ min: 1980, max: 2020 }).toString();
      await ImportantDatesPage.fillFamilyMember(name, year);
    }
    await expect(ImportantDatesPage.addFamilyMember).not.toBeDisplayed();
    const removeButtons = await $$('~remove_family_member_button');
    expect(removeButtons.length).toBe(4);
  });

  it('should allow removing a family member and navigate to Categories', async () => {
    const removeButtons = await $$('~remove_family_member_button');
    await removeButtons[0].click();
    await driver.pause(500);
    const remainingButtons = await $$('~remove_family_member_button');
    expect(remainingButtons.length).toBe(3);

    await ImportantDatesPage.tapContinue();
    await CategoryAndShopsPage.waitForScreen();
  });

  // ── Step 9: Categories and shops ─────────────────────────────────────────

  it('should display the categories heading', async () => {
    await expect($('//*[contains(@content-desc, "מה מעניין אותך")]')).toBeDisplayed();
  });

  it('should display the categories subtitle', async () => {
    await expect($('//*[contains(@content-desc, "אפשר לבחור יותר מאפשרות אחת")]')).toBeDisplayed();
  });

  it('should display the Join button', async () => {
    await expect(CategoryAndShopsPage.joinButton).toBeDisplayed();
  });

  it('should display the Complete Later button', async () => {
    await expect(CategoryAndShopsPage.completeLaterButton).toBeDisplayed();
  });

  it('should complete categories selection and navigate to Home', async () => {
    await completeCategoriesHappyPath();
    await deleteAccount();
  });
});
