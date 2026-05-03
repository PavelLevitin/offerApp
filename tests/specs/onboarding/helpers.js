const WelcomePage          = require('../../pageObjects/WelcomePage');
const HomePage             = require('../../pageObjects/HomePage');
const MenuPage             = require('../../pageObjects/MenuPage');
const PhoneEntryPage       = require('../../pageObjects/PhoneEntryPage');
const OTPPage              = require('../../pageObjects/OTPPage');
const RegistrationPage1    = require('../../pageObjects/RegistrationPage1');
const ImportantDatesPage   = require('../../pageObjects/ImportantDatesPage');
const CategoryAndShopsPage = require('../../pageObjects/CategoryAndShopsPage');
const PersonalAreaPage     = require('../../pageObjects/PersonalAreaPage');
const DeleteAccountPage    = require('../../pageObjects/DeleteAccountPage');
const testData             = require('../../data/testData');
const sessionData          = require('../../data/sessionData');
const { faker }            = require('@faker-js/faker');
const { clearField, typeText } = require('../../helpers/typeText');

async function goToWelcomeScreen() {
  await driver.pause(3000);
  await WelcomePage.waitForScreen();
}

async function goThroughMallSelection() {
  await WelcomePage.clickSortByLocation();
  await WelcomePage.selectFirstMall();
  await HomePage.waitForScreen();
}

async function navigateToPhoneEntry() {
  await HomePage.menuButton.click();
  await MenuPage.waitForScreen();
  await MenuPage.tapLoginOrRegister();
  await PhoneEntryPage.waitForScreen();
}

async function submitPhone() {
  await PhoneEntryPage.enterPhone(testData.credentials.testPhone);
  sessionData.phone = testData.credentials.testPhone;
  await PhoneEntryPage.tapSendCode();
  await OTPPage.waitForScreen();
}

async function waitAndEnterOTP() {
  await OTPPage.enterOTP(testData.credentials.testOtp);
  await OTPPage.tapContinue();

  // Detect where we landed: Registration form (new user) or Home (existing account)
  const isNewUser = await $('//*[@hint="שם פרטי"]')
    .waitForDisplayed({ timeout: 5000 })
    .then(() => true)
    .catch(() => false);

  if (!isNewUser) {
    // Existing account detected — delete it via hamburger → My Account → דיוור → delete
    await HomePage.waitForScreen();
    await navigateToMailingTab();
    await PersonalAreaPage.navigateToDeleteAccount();
    await DeleteAccountPage.waitForScreen();
    await DeleteAccountPage.tapContinue();
    await DeleteAccountPage.waitForSuccessDialog();
    await DeleteAccountPage.tapGoHome();
    await HomePage.waitForScreen();
    // Re-enter phone and OTP for fresh registration
    await navigateToPhoneEntry();
    await submitPhone();
    await OTPPage.enterOTP(testData.credentials.testOtp);
    await OTPPage.tapContinue();
  }

  await RegistrationPage1.waitForScreen();
}

async function completeRegistrationFormHappyPath() {
  await RegistrationPage1.fillFirstName(testData.registration.firstName, false, false);
  await RegistrationPage1.fillLastName(testData.registration.lastName, false);
  await RegistrationPage1.fillEmail(testData.registration.email, true, false);
  try { await driver.hideKeyboard(); } catch (_) {}
  await RegistrationPage1.selectGender('אחר');
  await RegistrationPage1.selectFirstMall();
  sessionData.mallName = RegistrationPage1.selectedMallName;
  await RegistrationPage1.toggleTerms();
  await RegistrationPage1.tapContinue();
  sessionData.firstName = testData.registration.firstName;
  sessionData.lastName  = testData.registration.lastName;
  sessionData.email     = testData.registration.email;
  sessionData.gender    = 'אחר';
  await ImportantDatesPage.waitForScreen();
}

async function completeImportantDatesHappyPath() {
  const collectedMembers = [];
  await ImportantDatesPage.selectBirthday(testData.importantDates.birthYear);
  sessionData.birthYear = testData.importantDates.birthYear;
  await ImportantDatesPage.selectWeddingAnniversary(testData.importantDates.anniversaryYear);
  sessionData.anniversaryYear = testData.importantDates.anniversaryYear;

  for (let i = 0; i < 4; i++) {
    if (i > 0) {
      await ImportantDatesPage.tapAddMember();
    }
    const name = faker.person.firstName();
    const year = faker.number.int({ min: 1980, max: 2020 }).toString();
    await ImportantDatesPage.fillFamilyMember(name, year);
    collectedMembers.push({ name, year });
  }

  const removeButtons = await $$('~remove_family_member_button');
  await removeButtons[0].click();
  await driver.pause(500);
  collectedMembers.shift();
  sessionData.familyMembers = [...collectedMembers];

  await ImportantDatesPage.tapContinue();
  await CategoryAndShopsPage.waitForScreen();
}

async function completeCategoriesHappyPath() {
  await CategoryAndShopsPage.selectCategoryAndJoin();
  sessionData.categories = CategoryAndShopsPage.selectedCategories;
  sessionData.stores     = CategoryAndShopsPage.selectedStores;
  console.log('[sessionData]', JSON.stringify(sessionData, null, 2));
  await HomePage.waitForScreen();
}

async function navigateToPersonalArea(tab) {
  await HomePage.menuButton.click();
  await MenuPage.waitForScreen();
  await MenuPage.tapMyAccount();
  await PersonalAreaPage.waitForScreen();
  if (tab === 'personalDetailsTab') {
    await PersonalAreaPage.personalDetailsTab.click();
  } else if (tab === 'interestsTab') {
    await PersonalAreaPage.interestsTab.click();
  } else if (tab === 'importantDatesTab') {
    await PersonalAreaPage.importantDatesTab.click();
  }
  await driver.pause(1000);
}

async function deleteAccount() {
  await navigateToMailingTab();
  await PersonalAreaPage.navigateToDeleteAccount();
  await DeleteAccountPage.waitForScreen();
  await DeleteAccountPage.tapContinue();
  await DeleteAccountPage.waitForSuccessDialog();
  await DeleteAccountPage.tapGoHome();
  await HomePage.waitForScreen();
}

async function completePersonalAreaDetailsHappyPath() {
  await navigateToPersonalArea('personalDetailsTab');

  const newFirstName = faker.person.firstName();
  const fnField = await $('//android.widget.ScrollView/android.widget.EditText[2]/android.widget.EditText');
  await fnField.click();
  await clearField(30);
  await typeText(newFirstName);
  try { await driver.hideKeyboard(); } catch (_) {}
  await PersonalAreaPage.saveButton.click();
  await PersonalAreaPage.successToast.waitForDisplayed({ timeout: 5000 });
  await driver.pause(1500);
  sessionData.firstName = newFirstName;

  const newLastName = faker.person.lastName();
  const lnField = await $('//android.widget.ScrollView/android.widget.EditText[1]/android.widget.EditText');
  await lnField.click();
  await clearField(30);
  await typeText(newLastName);
  try { await driver.hideKeyboard(); } catch (_) {}
  await PersonalAreaPage.saveButton.click();
  await PersonalAreaPage.successToast.waitForDisplayed({ timeout: 5000 });
  await driver.pause(1500);
  sessionData.lastName = newLastName;

  const newEmail = faker.internet.email();
  const emailField = await $('//android.widget.ScrollView/android.widget.EditText[4]/android.widget.EditText');
  await emailField.click();
  await clearField(50);
  await typeText(newEmail);
  try { await driver.hideKeyboard(); } catch (_) {}
  await PersonalAreaPage.saveButton.click();
  await PersonalAreaPage.successToast.waitForDisplayed({ timeout: 10000 });
  await driver.pause(1500);
  sessionData.email = newEmail;

  const newGender = sessionData.gender === 'גבר' ? 'אישה' : 'גבר';
  await PersonalAreaPage.genderButton.click();
  await driver.pause(600);
  const option = $(`//*[contains(@content-desc, "${newGender}") and @clickable="true"]`);
  await option.waitForDisplayed({ timeout: 5000 });
  await option.click();
  await driver.pause(2000);
  await PersonalAreaPage.scrollUp();
  await driver.pause(500);
  await PersonalAreaPage.saveButton.click();
  await PersonalAreaPage.successToast.waitForDisplayed({ timeout: 15000 });
  await driver.pause(2000);
  sessionData.gender = newGender;
}

async function completePersonalAreaInterestsHappyPath() {
  await navigateToPersonalArea('interestsTab');
}

async function navigateToMailingTab() {
  await HomePage.menuButton.click();
  await MenuPage.waitForScreen();
  await MenuPage.tapMyAccount();
  await PersonalAreaPage.waitForScreen();
  await PersonalAreaPage.importantDatesTab.waitForDisplayed({ timeout: 10000 });
  await PersonalAreaPage.importantDatesTab.click();
  await driver.pause(500);

  await driver.action('pointer', {
    type: 'pointer', id: 'finger1',
    parameters: { pointerType: 'touch' },
  })
    .move({ duration: 0, x: 800, y: 1200 })
    .down({ button: 0 })
    .move({ duration: 600, x: 100, y: 1200 })
    .up({ button: 0 })
    .perform();
  await driver.pause(500);

  await PersonalAreaPage.mailingTab.waitForDisplayed({ timeout: 5000 });
  await PersonalAreaPage.mailingTab.click();
  await driver.pause(1500);
}

module.exports = {
  goToWelcomeScreen,
  goThroughMallSelection,
  navigateToPhoneEntry,
  submitPhone,
  waitAndEnterOTP,
  completeRegistrationFormHappyPath,
  completeImportantDatesHappyPath,
  completeCategoriesHappyPath,
  navigateToPersonalArea,
  navigateToMailingTab,
  deleteAccount,
  completePersonalAreaDetailsHappyPath,
  completePersonalAreaInterestsHappyPath,
};
