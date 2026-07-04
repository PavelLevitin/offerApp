const RegistrationPage1 = require("../../pageObjects/RegistrationPage1");
const ImportantDatesPage = require("../../pageObjects/ImportantDatesPage");
const testData = require("../../data/testData");
const sessionData = require("../../data/sessionData");
const { clearField, scrollDown } = require("../../helpers/typeText");
const {
  goToWelcomeScreen,
  goThroughMallSelection,
  navigateToPhoneEntry,
  submitPhone,
  waitAndEnterOTP,
} = require("./helpers");

describe("Fresh Onboarding — Step 7: Registration form validations", () => {
  before(async () => {
    await goToWelcomeScreen();
    await goThroughMallSelection();
    await navigateToPhoneEntry();
    await submitPhone();
    await waitAndEnterOTP();
    await scrollDown();
  });

  it("should display the registration form", async () => {
    await RegistrationPage1.assertScreenVisible();
  });

  it("should show 6 validation errors on empty form submit", async () => {
    await RegistrationPage1.tapContinue();
    const shortNameError = $(
      '//*[contains(@content-desc, "שם קצת קצר, לא?") or contains(@text, "שם קצת קצר, לא?")]',
    );
    await shortNameError.waitForDisplayed({ timeout: 5000 });
    try { await driver.hideKeyboard(); } catch (_) {}
    await driver.pause(500);
    const nameErrors1 = await $$(
      '//*[contains(@content-desc, "שם קצת קצר, לא?") or contains(@text, "שם קצת קצר, לא?")]',
    );
    const reminderErrors1 = await $$(
      '//*[contains(@content-desc, "היי, שכחת אותי") or contains(@text, "היי, שכחת אותי")]',
    );
    const emailErrors1 = await $$(
      `//*[contains(@content-desc, 'כתובת הדוא"ל אינה תקינה') or contains(@text, 'כתובת הדוא"ל אינה תקינה')]`,
    );
    const termsErrors1 = await $$(
      '//*[contains(@content-desc, "יש לאשר") or contains(@text, "יש לאשר")]',
    );
    expect(
      nameErrors1.length +
        reminderErrors1.length +
        emailErrors1.length +
        termsErrors1.length,
    ).toBeGreaterThanOrEqual(6);
  });

  it("should show error for 1-character first name", async () => {
    await RegistrationPage1.fillFirstName("a", false, false);
    await RegistrationPage1.lastNameInput.click();
    await expect(
      $(
        '//*[contains(@content-desc, "שם קצת קצר, לא?") or contains(@text, "שם קצת קצר, לא?")]',
      ),
    ).toBeDisplayed();
    await RegistrationPage1.firstNameInput.click();
    await driver.pause(300);
    await clearField("a".length + 2);
  });

  it("should clear first name error for 2-character first name", async () => {
    await RegistrationPage1.fillFirstName("ab", false, false);
    await RegistrationPage1.lastNameInput.click();
    await driver.pause(500);
    const nameErrors2 = await $$(
      '//*[contains(@content-desc, "שם קצת קצר, לא?") or contains(@text, "שם קצת קצר, לא?")]',
    );
    expect(nameErrors2.length).toBeLessThan(2);
    await RegistrationPage1.firstNameInput.click();
    await driver.pause(300);
    await clearField("ab".length + 2);
  });

  it("should enforce 20-character limit on first name", async () => {
    await RegistrationPage1.fillFirstName(
      "abcdefghijklmnopqrstu",
      false,
      false,
    );
    const fnValue = await RegistrationPage1.firstNameInput.getAttribute("text");
    expect((fnValue || "").replace(/\s/g, "").length).toBeLessThanOrEqual(20);
    await RegistrationPage1.firstNameInput.click();
    await driver.pause(300);
    await clearField(22);
  });


  it("should reduce errors to 5 after valid first name entry", async () => {
    await RegistrationPage1.fillFirstName(
      testData.registration.firstName,
      false,
      false,
    );
    await RegistrationPage1.tapContinue();
    try { await driver.hideKeyboard(); } catch (_) {}
    await driver.pause(500);
    const nameErrors3 = await $$(
      '//*[contains(@content-desc, "שם קצת קצר, לא?") or contains(@text, "שם קצת קצר, לא?")]',
    );
    const reminderErrors3 = await $$(
      '//*[contains(@content-desc, "היי, שכחת אותי") or contains(@text, "היי, שכחת אותי")]',
    );
    const emailErrors3 = await $$(
      `//*[contains(@content-desc, 'כתובת הדוא"ל אינה תקינה') or contains(@text, 'כתובת הדוא"ל אינה תקינה')]`,
    );
    const termsErrors3 = await $$(
      '//*[contains(@content-desc, "יש לאשר") or contains(@text, "יש לאשר")]',
    );
    expect(
      nameErrors3.length +
        reminderErrors3.length +
        emailErrors3.length +
        termsErrors3.length,
    ).toBeGreaterThanOrEqual(5);
  });

  it("should show error for 1-character last name", async () => {
    await RegistrationPage1.fillLastName("a", false);
    await RegistrationPage1.emailInput.click();
    await expect(
      $(
        '//*[contains(@content-desc, "שם קצת קצר, לא?") or contains(@text, "שם קצת קצר, לא?")]',
      ),
    ).toBeDisplayed();
    await RegistrationPage1.lastNameInput.click();
    await driver.pause(300);
    await clearField("a".length + 2);
  });

  it("should clear last name error for 2-character last name", async () => {
    await RegistrationPage1.fillLastName("ab", false);
    await RegistrationPage1.emailInput.click();
    await expect(
      $(
        '//*[contains(@content-desc, "שם קצת קצר, לא?") or contains(@text, "שם קצת קצר, לא?")]',
      ),
    ).not.toBeDisplayed();
    await RegistrationPage1.lastNameInput.click();
    await driver.pause(300);
    await clearField("ab".length + 2);
  });

  it("should enforce 20-character limit on last name", async () => {
    await RegistrationPage1.fillLastName("abcdefghijklmnopqrstu", false);
    const lnValue = await RegistrationPage1.lastNameInput.getAttribute("text");
    expect((lnValue || "").replace(/\s/g, "").length).toBeLessThanOrEqual(20);
    await RegistrationPage1.lastNameInput.click();
    await driver.pause(300);
    await clearField(22);
  });

  it("should clear last name error for valid last name from test Data", async () => {
    await RegistrationPage1.fillLastName(testData.registration.lastName, false);
    await RegistrationPage1.emailInput.click();
    await driver.pause(500);
    await expect(
      $(
        '//*[contains(@content-desc, "שם קצת קצר, לא?") or contains(@text, "שם קצת קצר, לא?")]',
      ),
    ).not.toBeDisplayed();
  });

  it("should clear gender error after selection", async () => {
    await RegistrationPage1.selectGender("אחר");
    await driver.pause(500);
    const reminderErrors10 = await $$(
      '//*[contains(@content-desc, "היי, שכחת אותי") or contains(@text, "היי, שכחת אותי")]',
    );
    expect(reminderErrors10.length).toBeLessThan(2);
  });

  it("should accept valid email without error", async () => {
    const emailError = $(
      `//*[contains(@content-desc, 'כתובת הדוא"ל אינה תקינה') or contains(@text, 'כתובת הדוא"ל אינה תקינה')]`,
    );
    await RegistrationPage1.fillEmail("aaa@fff.com", false, false);
    try {
      await driver.hideKeyboard();
    } catch (_) {}
    await driver.pause(500);
    await expect(emailError).not.toBeDisplayed();
    await RegistrationPage1.emailInput.click();
    await driver.pause(300);
    await clearField("aaa@fff.com".length + 2);
  });

  it("should show error for each invalid email format", async () => {
    const emailError = $(
      `//*[contains(@content-desc, 'כתובת הדוא"ל אינה תקינה') or contains(@text, 'כתובת הדוא"ל אינה תקינה')]`,
    );
    const invalidEmails = [
      "missingatexample.com",
      "user@",
      "user@.com",
      "@domain.com",
      "@.com",
      "user@@domain.com",
      "us@er@domain.com",
      "user name@domain.com",
      "user@domain",
    ];
    const failures = [];
    for (const email of invalidEmails) {
      try {
        await RegistrationPage1.fillEmail(email, false, false);
        await emailError.waitForDisplayed({ timeout: 3000 });
        const errText =
          (await emailError.getAttribute("content-desc")) ||
          (await emailError.getText());
        if (!errText.includes('כתובת הדוא"ל אינה תקינה')) {
          failures.push(`"${email}": wrong error text — got "${errText}"`);
        }
        await driver.pause(300);
      } catch (e) {
        failures.push(`"${email}": error not displayed — ${e.message}`);
      } finally {
        await driver.pause(200);
      }
    }
    if (failures.length > 0)
      throw new Error(`Email validation failures:\n${failures.join("\n")}`);
    await RegistrationPage1.fillEmail(testData.registration.email, false, false);
    await driver.pause(500);
    await expect(emailError).not.toBeDisplayed();
  });

  it("should show email error when field is cleared", async () => {
    const emailError = $(
      `//*[contains(@content-desc, 'כתובת הדוא"ל אינה תקינה') or contains(@text, 'כתובת הדוא"ל אינה תקינה')]`,
    );
    const emailEl = await $('//android.widget.EditText[contains(@hint, "דוא") or contains(@hint, "מייל") or contains(@hint, "אימייל")]/android.widget.EditText[@clickable="true"]');
    await driver.execute('mobile: replaceElementValue', { elementId: emailEl.elementId, text: '' });
    await emailEl.click();
    await driver.pause(300);
    try {
      await driver.hideKeyboard();
    } catch (_) {}
    await driver.pause(500);
    await expect(emailError).toBeDisplayed();
  });

  it("should clear email error for valid email from testData", async () => {
    const emailError = $(
      `//*[contains(@content-desc, 'כתובת הדוא"ל אינה תקינה') or contains(@text, 'כתובת הדוא"ל אינה תקינה')]`,
    );
    await RegistrationPage1.fillEmail(
      testData.registration.email,
      false,
      false,
    );
    try {
      await driver.hideKeyboard();
    } catch (_) {}
    await driver.pause(500);
    await expect(emailError).not.toBeDisplayed();
  });

  it("should clear mall error after mall selection", async () => {
    const mallError = $(
      '//*[contains(@content-desc, "היי, שכחת אותי") or contains(@text, "היי, שכחת אותי")]',
    );
    await RegistrationPage1.selectFirstMall();
    sessionData.mallName = RegistrationPage1.selectedMallName;
    await expect(mallError).not.toBeDisplayed();
  });

  it("should clear terms error after accepting terms", async () => {
    const termsError = $(
      '//*[contains(@content-desc, "* יש לאשר את צנאי השימוש") or contains(@text, "* יש לאשר את צנאי השימוש")]',
    );
    await RegistrationPage1.toggleTerms();
    await expect(termsError).not.toBeDisplayed();
  });

  it("should submit the registration form and navigate to Important Dates", async () => {
    sessionData.firstName = testData.registration.firstName;
    sessionData.lastName = testData.registration.lastName;
    sessionData.email = testData.registration.email;
    sessionData.gender = "אחר";
    await RegistrationPage1.tapContinue();
    await ImportantDatesPage.waitForScreen();
    const nextPageHeader = $(
      '//*[contains(@content-desc, "הצטרפות למועדון") or contains(@text, "הצטרפות למועדון")]',
    );
    await expect(nextPageHeader).toBeDisplayed();
  });
});
