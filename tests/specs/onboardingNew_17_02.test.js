const WelcomePage          = require('../pageObjects/WelcomePage');
const HomePage             = require('../pageObjects/HomePage');
const MenuPage             = require('../pageObjects/MenuPage');
const PhoneEntryPage       = require('../pageObjects/PhoneEntryPage');
const OTPPage              = require('../pageObjects/OTPPage');
const RegistrationPage1    = require('../pageObjects/RegistrationPage1');
const ImportantDatesPage   = require('../pageObjects/ImportantDatesPage');
const CategoryAndShopsPage = require('../pageObjects/CategoryAndShopsPage');
const PersonalAreaPage     = require('../pageObjects/PersonalAreaPage');
const DeleteAccountPage    = require('../pageObjects/DeleteAccountPage');
const testData             = require('../data/testData');
const sessionData          = require('../data/sessionData');
const { clearField }       = require('../helpers/typeText');
const { faker }            = require('@faker-js/faker');

/**
 * Fresh Onboarding Full Flow
 *
 * Prerequisites: fresh install (wdio.onboardingNew.conf.js — fullReset: true, autoGrantPermissions: true).
 * Covers the complete loop:
 *   Fresh start → Welcome → Mall → Home → Register → OTP → Personal details
 *   → Important dates → Categories & shops → Delete account
 */
describe('Fresh Onboarding Full Flow', () => {

  // ── Step 1: Welcome screen ──────────────────────────────────────────────────

  describe('Welcome screen', () => {

    before(async () => {
      await driver.pause(3000);
      await WelcomePage.waitForScreen();
    });

    it('should display the Welcome screen on first launch', async () => {
      await WelcomePage.assertWelcomeScreenVisible();
    });

    it('should display all three region tabs', async () => {
      await WelcomePage.assertAllRegionTabsVisible();
    });

  });

  // ── Step 2: Mall selection ──────────────────────────────────────────────────

  describe('Mall selection', () => {

    it('should click the sort by location button', async () => {
      await WelcomePage.clickSortByLocation();
    });

    it('should display at least one mall in the list', async () => {
      await WelcomePage.assertMallListNotEmpty();
    });

    it('should navigate to Home screen after selecting a mall', async () => {
      await WelcomePage.selectFirstMall();
      await HomePage.waitForScreen();
    });

  });

  // ── Step 3: Home screen ─────────────────────────────────────────────────────

  describe('Home screen', () => {

    before(async () => {
      const isHome = await HomePage.menuButton.isDisplayed().catch(() => false);
      if (!isHome) {
        await WelcomePage.selectFirstMall();
        await HomePage.waitForScreen();
      }
    });

    it('should display the home screen content', async () => {
      await HomePage.assertHomeScreenVisible();
    });

    it('should display the bottom navigation bar', async () => {
      await HomePage.assertBottomNavVisible();
    });

    it('should display the top bar with menu and search', async () => {
      await HomePage.assertTopBarVisible();
    });

  });

  // ── Step 4: Navigate to registration ───────────────────────────────────────

  describe('Navigate to registration', () => {

    it('should open the menu from Home screen', async () => {
      await HomePage.menuButton.click();
      await MenuPage.waitForScreen();
    });

    it('should tap Login/Register and navigate to Phone Entry screen', async () => {
      await MenuPage.tapLoginOrRegister();
      await PhoneEntryPage.waitForScreen();
    });

    it('should display the Phone Entry screen', async () => {
      const title2 = $('//*[contains(@content-desc, "מה מספר הנייד שלכם?") or contains(@text, "מה מספר הנייד שלכם?")]');
      await expect(title2).toBeDisplayed();
      await expect(PhoneEntryPage.phoneInput).toBeDisplayed();
      await expect(PhoneEntryPage.sendCodeButton).toBeDisplayed();
    });

  });

  // ── Step 5: Phone entry ─────────────────────────────────────────────────────

  describe('Phone entry', () => {

    it('should have CTA disabled before entering phone', async () => {
      await expect(PhoneEntryPage.sendCodeButton).not.toBeEnabled();
    });

    it('should keep CTA disabled when phone number has less than 10 digits', async () => {
      await PhoneEntryPage.enterPhone('05012345'); // 8 digits — too short
      await expect(PhoneEntryPage.sendCodeButton).not.toBeEnabled();
    });

    it('should show an error when phone does not start with 05', async () => {
      await PhoneEntryPage.enterPhone('0312345678');
      await PhoneEntryPage.sendCodeButton.click();
      const prefixError = $('//*[contains(@content-desc, "מספר טלפון לא תקין") or contains(@text, "מספר טלפון לא תקין")]');
      await prefixError.waitForDisplayed({ timeout: 3000 });
      await expect(prefixError).toBeDisplayed();
    });

    it('should enter phone number and CTA turns enabled', async () => {
      await PhoneEntryPage.enterPhone(testData.credentials.testPhone);
      await expect(PhoneEntryPage.sendCodeButton).toBeEnabled();
    });

    it('should submit phone and navigate to OTP screen', async () => {
      await PhoneEntryPage.tapSendCode();
      await OTPPage.waitForScreen();
      await expect(OTPPage.title).toBeDisplayed();
      await expect(OTPPage.otpInput).toBeDisplayed();
      await expect(OTPPage.continueButton).toBeDisplayed();
    });

  });

  // ── Step 6: OTP entry ───────────────────────────────────────────────────────

  describe('OTP entry', () => {

    it('should display the OTP screen', async () => {
      await expect(OTPPage.title).toBeDisplayed();
      await expect(OTPPage.otpInput).toBeDisplayed();
      await expect(OTPPage.continueButton).toBeDisplayed();
    });

    it('should show countdown text and resend link disabled, then enable resend after countdown', async () => {
      const countdownText = $('//*[contains(@content-desc, "אפשר לקבל קוד חדש בעוד") or contains(@text, "אפשר לקבל קוד חדש בעוד")]');
      await expect(countdownText).toBeDisplayed();

      // resend link is visible but disabled while countdown runs
      await expect(OTPPage.resendLink).toBeDisplayed();
      await expect(OTPPage.resendLink).not.toBeEnabled();

      // resend link becomes enabled once the 45-second countdown expires
      await OTPPage.resendLink.waitForEnabled({ timeout: 50000 });
    });

    it('should show error when a wrong OTP is entered', async () => {
      await OTPPage.enterOTP('000000');
      await OTPPage.tapContinue();
      const otpError = $('//*[contains(@content-desc, "קוד") or contains(@text, "קוד")][@clickable="false"]');
      await otpError.waitForDisplayed({ timeout: 5000 });
      await expect(otpError).toBeDisplayed();
      // clear wrong OTP so the next test can enter the correct one
      await OTPPage.otpInput.click();
      await clearField(6);
    });

    it('should enter OTP and navigate to registration form', async () => {
      await OTPPage.enterOTP(testData.credentials.testOtp);
      await OTPPage.tapContinue();
      await RegistrationPage1.waitForScreen();
      await expect(RegistrationPage1.title).toBeDisplayed();
      await expect(RegistrationPage1.firstNameInput).toBeDisplayed();
    });

  });

  // ── Step 7: Registration form — personal details ────────────────────────────

  describe('Registration form — personal details', () => {

    // ── 1. Display ─────────────────────────────────────────────────────────────

    it('should display registration form page 1', async () => {
      await RegistrationPage1.assertScreenVisible();
    });

    // ── 2-4. Tap Continue on empty form → all 6 validation errors appear ───────

    it('should show all 6 validation errors when Continue is tapped on empty form', async () => {
      await RegistrationPage1.tapContinue(); // hides keyboard, clicks המשך
      const shortNameError = $('//*[contains(@content-desc, "שם קצת קצר, לא?") or contains(@text, "שם קצת קצר, לא?")]');
      // wait for errors to appear
      await shortNameError.waitForDisplayed({ timeout: 5000 });
      // count all errors — errors may be identical (firstName + lastName share same text, gender + mall share same text)
      const nameErrors    = await $$('//*[contains(@content-desc, "שם קצת קצר, לא?") or contains(@text, "שם קצת קצר, לא?")]');
      const reminderErrors = await $$('//*[contains(@content-desc, "היי, שכחת אותי") or contains(@text, "היי, שכחת אותי")]');
      const emailErrors   = await $$(`//*[contains(@content-desc, 'כתובת הדוא"ל אינה תקינה') or contains(@text, 'כתובת הדוא"ל אינה תקינה')]`);
      const termsErrors   = await $$('//*[contains(@content-desc, "יש לאשר") or contains(@text, "יש לאשר")]');
      const totalErrors = nameErrors.length + reminderErrors.length + emailErrors.length + termsErrors.length;
      expect(totalErrors).toBeGreaterThanOrEqual(6);
    });

    // ── 5. First name validation ────────────────────────────────────────────────

    // 5.1 — 1 char: error remains
    it('should keep first name error when 1 char is entered', async () => {
      const shortNameError = $('//*[contains(@content-desc, "שם קצת קצר, לא?") or contains(@text, "שם קצת קצר, לא?")]');
      await RegistrationPage1.fillFirstName('a', false, false);
      await RegistrationPage1.lastNameInput.click(); // blur → triggers validation
      await expect(shortNameError).toBeDisplayed();
      await RegistrationPage1.firstNameInput.click();
      await driver.pause(300);
      await clearField('a'.length + 2);
    });

    // 5.2 — 2 chars: firstName error clears (only lastName error remains)
    it('should clear first name error when 2 chars are entered', async () => {
      await RegistrationPage1.fillFirstName('ab', false, false);
      await RegistrationPage1.lastNameInput.click(); // blur
      await driver.pause(500);
      // firstName error is gone — only lastName's identical error may remain (count drops from 2 to 1)
      const nameErrors = await $$('//*[contains(@content-desc, "שם קצת קצר, לא?") or contains(@text, "שם קצת קצר, לא?")]');
      expect(nameErrors.length).toBeLessThan(2);
      await RegistrationPage1.firstNameInput.click();
      await driver.pause(300);
      await clearField('ab'.length + 2);
    });

    // 5.3 — max 20 chars enforced
    it('should not allow more than 20 characters in first name', async () => {
      await RegistrationPage1.fillFirstName('abcdefghijklmnopqrstu', false, false); // 21 chars
      const value = await RegistrationPage1.firstNameInput.getAttribute('text');
      expect((value || '').replace(/\s/g, '').length).toBeLessThanOrEqual(20);
      await RegistrationPage1.firstNameInput.click();
      await driver.pause(300);
      await clearField(22); // app enforces 20 max + 2 safety
    });

    // 5.4 enter name, 5.5 minimize keyboard, 5.6 click המשך, 5.7 firstName error gone — 5 errors remain
    it('should accept valid first name and show only remaining validation errors', async () => {
      await RegistrationPage1.fillFirstName(testData.registration.firstName, false, false); // 5.4
      await RegistrationPage1.tapContinue(); // 5.5 hideKeyboard + 5.6 click המשך
      // 5.7 — total 5 errors remain (lastName + gender + email + mall + terms) — errors may be identical
      const nameErrors     = await $$('//*[contains(@content-desc, "שם קצת קצר, לא?") or contains(@text, "שם קצת קצר, לא?")]');
      const reminderErrors = await $$('//*[contains(@content-desc, "היי, שכחת אותי") or contains(@text, "היי, שכחת אותי")]');
      const emailErrors    = await $$(`//*[contains(@content-desc, 'כתובת הדוא"ל אינה תקינה') or contains(@text, 'כתובת הדוא"ל אינה תקינה')]`);
      const termsErrors    = await $$('//*[contains(@content-desc, "יש לאשר") or contains(@text, "יש לאשר")]');
      const totalErrors = nameErrors.length + reminderErrors.length + emailErrors.length + termsErrors.length;
      expect(totalErrors).toBeGreaterThanOrEqual(5);
    });

    // ── 6. Last name validation ─────────────────────────────────────────────────

    // 6.1 — 1 char: error remains
    it('should keep last name error when 1 char is entered', async () => {
      const shortNameError = $('//*[contains(@content-desc, "שם קצת קצר, לא?") or contains(@text, "שם קצת קצר, לא?")]');
      await RegistrationPage1.fillLastName('a', false);
      await RegistrationPage1.emailInput.click(); // blur → triggers validation (no scroll needed)
      await expect(shortNameError).toBeDisplayed();
      await RegistrationPage1.lastNameInput.click();
      await driver.pause(300);
      await clearField('a'.length + 2);
    });

    // 6.2 — 2 chars: error clears
    it('should clear last name error when 2 chars are entered', async () => {
      const shortNameError = $('//*[contains(@content-desc, "שם קצת קצר, לא?") or contains(@text, "שם קצת קצר, לא?")]');
      await RegistrationPage1.fillLastName('ab', false);
      await RegistrationPage1.emailInput.click(); // blur (no scroll needed)
      await expect(shortNameError).not.toBeDisplayed();
      await RegistrationPage1.lastNameInput.click();
      await driver.pause(300);
      await clearField('ab'.length + 2);
    });

    // 6.3 — max 20 chars enforced
    it('should not allow more than 20 characters in last name', async () => {
      await RegistrationPage1.fillLastName('abcdefghijklmnopqrstu', false); // 21 chars
      const value = await RegistrationPage1.lastNameInput.getAttribute('text');
      expect((value || '').replace(/\s/g, '').length).toBeLessThanOrEqual(20);
      await RegistrationPage1.lastNameInput.click();
      await driver.pause(300);
      await clearField(22); // app enforces 20 max + 2 safety
    });

    // ── 7. Gender ───────────────────────────────────────────────────────────────

    it('should clear gender error after selecting a gender', async () => {
      await RegistrationPage1.selectGender('אחר');
      await driver.pause(500);
      // after selecting gender, one "היי, שכחת אותי" error disappears — only mall error remains (count drops by 1)
      const reminderErrors = await $$('//*[contains(@content-desc, "היי, שכחת אותי") or contains(@text, "היי, שכחת אותי")]');
      expect(reminderErrors.length).toBeLessThan(2);
    });

    // ── 8. Email validation ─────────────────────────────────────────────────────

    // 8.1 — valid email: no error → clear field
    it('should not show email error for a valid email', async () => {
      const emailError = $(`//*[contains(@content-desc, 'כתובת הדוא"ל אינה תקינה') or contains(@text, 'כתובת הדוא"ל אינה תקינה')]`);
      await RegistrationPage1.fillEmail('aaa@fff.com', false, false);
      try { await driver.hideKeyboard(); } catch (_) {}
      await driver.pause(500);
      await expect(emailError).not.toBeDisplayed();
      // clear email field ready for invalid-email tests
      await RegistrationPage1.emailInput.click();
      await driver.pause(300);
      await clearField('aaa@fff.com'.length + 2);
    });

    // 8.2 — invalid emails: each must show the email error
    it('should show email error for each invalid email in the list', async () => {
      const invalidEmails = [
        'missingatexample.com',
        'user@',
        'user@.com',
        '@domain.com',
        '@.com',
        'user@@domain.com',
        'us@er@domain.com',
        'user name@domain.com',
        'user@domain',
      ];
      const emailError = $(`//*[contains(@content-desc, 'כתובת הדוא"ל אינה תקינה') or contains(@text, 'כתובת הדוא"ל אינה תקינה')]`);
      const failures = [];
      for (const email of invalidEmails) {
        try {
          await RegistrationPage1.fillEmail(email, false, false);
          try { await driver.hideKeyboard(); } catch (_) {}
          await emailError.waitForDisplayed({ timeout: 3000 });
          const errText = await emailError.getAttribute('content-desc') || await emailError.getText();
          if (!errText.includes('כתובת הדוא"ל אינה תקינה')) {
            failures.push(`"${email}": wrong error text — got "${errText}"`);
          }
          await driver.pause(300);
        } catch (e) {
          failures.push(`"${email}": error not displayed — ${e.message}`);
        } finally {
          // clear exactly what was typed — extra backspaces escape to name input
          await RegistrationPage1.emailInput.click();
          await driver.pause(300);
          await clearField(email.length + 2);
        }
      }
      if (failures.length > 0) {
        throw new Error(`Email validation failures:\n${failures.join('\n')}`);
      }
    });

    // 8.3 — field cleared after invalid list: email error remains
    it('should keep email error when field is cleared after invalid emails', async () => {
      const emailError = $(`//*[contains(@content-desc, 'כתובת הדוא"ל אינה תקינה') or contains(@text, 'כתובת הדוא"ל אינה תקינה')]`);
      // field is already empty (cleared by previous test's finally); blur to trigger validation
      try { await driver.hideKeyboard(); } catch (_) {}
      await driver.pause(500);
      await expect(emailError).toBeDisplayed();
    });

    // 8.4-8.5 — valid email from testData: error clears → hide keyboard
    it('should clear email error after entering valid email from testData', async () => {
      const emailError = $(`//*[contains(@content-desc, 'כתובת הדוא"ל אינה תקינה') or contains(@text, 'כתובת הדוא"ל אינה תקינה')]`);
      await RegistrationPage1.fillEmail(testData.registration.email, false, false);
      try { await driver.hideKeyboard(); } catch (_) {}
      await driver.pause(500);
      await expect(emailError).not.toBeDisplayed();
    });

    // ── 9. Preferred mall ───────────────────────────────────────────────────────

    it('should clear mall error after selecting preferred mall', async () => {
      const mallError = $('//*[contains(@content-desc, "היי, שכחת אותי") or contains(@text, "היי, שכחת אותי")]');
      await RegistrationPage1.selectFirstMall();
      await expect(mallError).not.toBeDisplayed();
    });

    // ── 10. T&C ─────────────────────────────────────────────────────────────────

    it('should clear T&C error after toggling terms', async () => {
      const termsError = $('//*[contains(@content-desc, "* יש לאשר את צנאי השימוש") or contains(@text, "* יש לאשר את צנאי השימוש")]');
      await RegistrationPage1.toggleTerms();
      await expect(termsError).not.toBeDisplayed();
    });

    // ── Happy path: all fields valid → proceed ──────────────────────────────────

    it('should complete registration form and proceed to Important dates screen', async () => {
      await RegistrationPage1.fillLastName(testData.registration.lastName, false); // ensure lastName is filled
      await RegistrationPage1.tapContinue();
      await ImportantDatesPage.waitForScreen();
      const nextPageHeader = $('//*[contains(@content-desc, "הצטרפות למועדון") or contains(@text, "הצטרפות למועדון")]');
      await expect(nextPageHeader).toBeDisplayed();
      sessionData.firstName = testData.registration.firstName;
      sessionData.lastName  = testData.registration.lastName;
      sessionData.email     = testData.registration.email;
      sessionData.gender    = 'אחר';
    });

  });

  // ── Step 8: Important dates ─────────────────────────────────────────────────

  describe('Important dates', () => {

    it('should display all UI content on the important dates page', async () => {
      // title / header
      const header = $('//*[contains(@content-desc, "הצטרפות למועדון") or contains(@text, "הצטרפות למועדון")]');
      await expect(header).toBeDisplayed();

      // fields
      await expect(ImportantDatesPage.birthdayPicker).toBeDisplayed();
      await expect(ImportantDatesPage.weddingAnniversaryPicker).toBeDisplayed();

      // CTA
      await expect(ImportantDatesPage.continueButton).toBeDisplayed();
    });

    it('should display the important dates screen', async () => {
      await ImportantDatesPage.assertScreenVisible();
    });

    it('should have CTA disabled until birthday is selected', async () => {
      const disabledCta = $('//*[@content-desc="המשך" and @enabled="false"]');
      await expect(disabledCta).toExist();
    });

    it('should show error and keep CTA disabled when birthday is under 18 years', async () => {
      await ImportantDatesPage.selectBirthday('2010'); // 2026 - 2010 = 16 years old → under 18
      const ageError = $('//*[contains(@content-desc, "עליך להיות בן 18 לפחות כדי להירשם") or contains(@text, "עליך להיות בן 18 לפחות כדי להירשם")]');
      await ageError.waitForDisplayed({ timeout: 5000 });
      await expect(ageError).toBeDisplayed();
      const disabledCta = $('//*[@content-desc="המשך" and @enabled="false"]');
      await expect(disabledCta).toExist();
    });

    it('should clear error and enable CTA when valid birthday is selected', async () => {
      await ImportantDatesPage.selectBirthday(testData.importantDates.birthYear);
      const ageError = $('//*[contains(@content-desc, "עליך להיות בן 18 לפחות כדי להירשם") or contains(@text, "עליך להיות בן 18 לפחות כדי להירשם")]');
      await expect(ageError).not.toBeDisplayed();
      const enabledCta = $('//*[@content-desc="המשך" and @enabled="true"]');
      await expect(enabledCta).toExist();
    });

    it('should select wedding anniversary date', async () => {
      await ImportantDatesPage.selectWeddingAnniversary(testData.importantDates.anniversaryYear);
      // field shows selected date as DD/MM/YY inside the inner view
      const fieldText = await $('//*[contains(@hint, "יום נישואין")]').$('android.view.View').getAttribute('text');
      expect(fieldText).toContain('25'); // year 2025 → shown as DD/MM/25
      // CTA stays enabled — driven by birthday (>18 years) selected in the previous test, not by anniversary
      const enabledCta = $('//*[@content-desc="המשך" and @enabled="true"]');
      await expect(enabledCta).toExist();
    });

    it('should add up to 4 family members and verify all appear in the list', async () => {
      for (let i = 0; i < 4; i++) {
        if (i > 0) {
          await ImportantDatesPage.tapAddMember(); // tap "+" and scroll up
        }
        const name = faker.person.firstName();
        const year = faker.number.int({ min: 1980, max: 2020 }).toString(); // at least 5 years ago
        await ImportantDatesPage.fillFamilyMember(name, year);
      }
      // "+" button should be gone after 4 members
      await expect(ImportantDatesPage.addFamilyMember).not.toBeDisplayed();
      // all 4 remove buttons visible — confirms all members are in the list
      const removeButtons = await $$('~remove_family_member_button');
      expect(removeButtons.length).toBe(4);
    });

    it('should fill birthday and continue', async () => {
      const birthYear = testData.importantDates.birthYear;
      await ImportantDatesPage.selectBirthday(birthYear);
      sessionData.birthYear = birthYear;
      await ImportantDatesPage.tapContinue();
      await CategoryAndShopsPage.waitForScreen();
    });

  });

  // ── Step 9: Categories and shops ────────────────────────────────────────────

  describe('Categories and shops', () => {

    it('should display the categories and shops screen', async () => {
      await CategoryAndShopsPage.assertScreenVisible();
    });

    it('should select a category and store, then complete registration', async () => {
      await CategoryAndShopsPage.selectCategoryAndJoin();
      sessionData.categories = CategoryAndShopsPage.selectedCategories;
      sessionData.stores     = CategoryAndShopsPage.selectedStores;
      console.log('[sessionData]', JSON.stringify(sessionData, null, 2));
      await HomePage.waitForScreen();
    });

  });

  // ── Step 10: Delete account ─────────────────────────────────────────────────

  describe('Delete account', () => {

    before(async () => {
      await HomePage.menuButton.click();
      await MenuPage.waitForScreen();
      await MenuPage.tapMyAccount();
      await PersonalAreaPage.waitForScreen();
    });

    it('should navigate to delete account page', async () => {
      await PersonalAreaPage.navigateToDeleteAccount();
      await DeleteAccountPage.waitForScreen();
    });

    it('should complete account deletion', async () => {
      await DeleteAccountPage.tapContinue();
      await DeleteAccountPage.waitForSuccessDialog();
    });

    it('should return to Home screen after deletion', async () => {
      await DeleteAccountPage.tapGoHome();
      await HomePage.waitForScreen();
    });

  });

});
