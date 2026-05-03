const PersonalAreaPage = require('../../pageObjects/PersonalAreaPage');
const sessionData      = require('../../data/sessionData');
const { faker }        = require('@faker-js/faker');
const { clearField, typeText } = require('../../helpers/typeText');
const {
  goToWelcomeScreen,
  goThroughMallSelection,
  navigateToPhoneEntry,
  submitPhone,
  waitAndEnterOTP,
  completeRegistrationFormHappyPath,
  completeImportantDatesHappyPath,
  completeCategoriesHappyPath,
  navigateToPersonalArea,
  deleteAccount,
} = require('./helpers');

describe('Fresh Onboarding — Step 10: Personal Area: personal details tab', () => {
  before(async () => {
    await goToWelcomeScreen();
    await goThroughMallSelection();
    await navigateToPhoneEntry();
    await submitPhone();
    await waitAndEnterOTP();
    await completeRegistrationFormHappyPath();
    await completeImportantDatesHappyPath();
    await completeCategoriesHappyPath();
    await navigateToPersonalArea('personalDetailsTab');
  });

  it('should display save button as enabled', async () => {
    await expect(PersonalAreaPage.saveButton).toBeEnabled();
  });

  it('should display correct first name', async () => {
    const fnField = await $('//android.widget.ScrollView/android.widget.EditText[2]/android.widget.EditText');
    expect(await fnField.getAttribute('text')).toBe(sessionData.firstName);
  });

  it('should display correct last name', async () => {
    const lnField = await $('//android.widget.ScrollView/android.widget.EditText[1]/android.widget.EditText');
    expect(await lnField.getAttribute('text')).toBe(sessionData.lastName);
  });

  it('should display correct email', async () => {
    const emailField = await $('//android.widget.ScrollView/android.widget.EditText[4]/android.widget.EditText');
    expect(await emailField.getAttribute('text')).toBe(sessionData.email);
  });

  it('should display correct phone number', async () => {
    const phoneView = await $('//android.widget.ScrollView/android.widget.EditText[3]/android.view.View');
    expect(await phoneView.getAttribute('text')).toBe(sessionData.phone);
  });

  it('should display correct gender', async () => {
    const contentDesc    = await PersonalAreaPage.genderButton.getAttribute('content-desc');
    const selectedGender = contentDesc.split('\n').pop();
    expect(selectedGender).toBe(sessionData.gender);
  });

  it('should allow changing first name and show success toast', async () => {
    const newFirstName = faker.person.firstName();
    const fnField = await $('//android.widget.ScrollView/android.widget.EditText[2]/android.widget.EditText');
    await fnField.click();
    await clearField(30);
    await typeText(newFirstName);
    try { await driver.hideKeyboard(); } catch (_) {}
    await expect(PersonalAreaPage.saveButton).toBeEnabled();
    await PersonalAreaPage.saveButton.click();
    await PersonalAreaPage.successToast.waitForDisplayed({ timeout: 5000 });
    await driver.pause(1500);
  });

  it('should allow changing last name and show success toast', async () => {
    const newLastName = faker.person.lastName();
    const lnField2 = await $('//android.widget.ScrollView/android.widget.EditText[1]/android.widget.EditText');
    await lnField2.click();
    await clearField(30);
    await typeText(newLastName);
    try { await driver.hideKeyboard(); } catch (_) {}
    await expect(PersonalAreaPage.saveButton).toBeEnabled();
    await PersonalAreaPage.saveButton.click();
    await PersonalAreaPage.successToast.waitForDisplayed({ timeout: 5000 });
    await driver.pause(1500);
  });

  it('should allow changing email and show success toast', async () => {
    const newEmail = faker.internet.email();
    const emailField2 = await $('//android.widget.ScrollView/android.widget.EditText[4]/android.widget.EditText');
    await emailField2.click();
    await clearField(50);
    await typeText(newEmail);
    try { await driver.hideKeyboard(); } catch (_) {}
    await expect(PersonalAreaPage.saveButton).toBeEnabled();
    await driver.pause(500);
    await PersonalAreaPage.saveButton.click();
    await PersonalAreaPage.successToast.waitForDisplayed({ timeout: 10000 });
    await driver.pause(1500);
  });

  it('should allow changing gender and show success toast', async () => {
    const newGender = sessionData.gender === 'גבר' ? 'אישה' : 'גבר';
    await PersonalAreaPage.genderButton.click();
    await driver.pause(600);
    const option = $(`//*[contains(@content-desc, "${newGender}") and @clickable="true"]`);
    await option.waitForDisplayed({ timeout: 5000 });
    await option.click();
    await driver.pause(2000);
    await expect(PersonalAreaPage.saveButton).toBeEnabled();
    await PersonalAreaPage.scrollUp();
    await driver.pause(500);
    await PersonalAreaPage.saveButton.click();
    await PersonalAreaPage.successToast.waitForDisplayed({ timeout: 15000 });
    await driver.pause(2000);

    await deleteAccount();
  });
});
