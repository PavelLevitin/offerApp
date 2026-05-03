const HomePage          = require('../../pageObjects/HomePage');
const PersonalAreaPage  = require('../../pageObjects/PersonalAreaPage');
const MailingTabPage    = require('../../pageObjects/MailingTabPage');
const DeleteAccountPage = require('../../pageObjects/DeleteAccountPage');
const {
  goToWelcomeScreen,
  goThroughMallSelection,
  navigateToPhoneEntry,
  submitPhone,
  waitAndEnterOTP,
  completeRegistrationFormHappyPath,
  completeImportantDatesHappyPath,
  completeCategoriesHappyPath,
  navigateToMailingTab,
} = require('./helpers');

describe('Fresh Onboarding — Step 13: Mailing settings and Delete account', () => {
  before(async () => {
    await goToWelcomeScreen();
    await goThroughMallSelection();
    await navigateToPhoneEntry();
    await submitPhone();
    await waitAndEnterOTP();
    await completeRegistrationFormHappyPath();
    await completeImportantDatesHappyPath();
    await completeCategoriesHappyPath();
    await navigateToMailingTab();
  });

  it('should display all mailing toggles and labels', async () => {
    await expect(MailingTabPage.sectionTitleLabel).toBeDisplayed();
    await expect(MailingTabPage.emailMailingToggle).toBeDisplayed();
    await expect(MailingTabPage.smsMailingToggle).toBeDisplayed();
    await expect(MailingTabPage.whatsappMailingToggle).toBeDisplayed();
    await expect(MailingTabPage.appNotificationsToggle).toBeDisplayed();
  });

  it('should display the delete account section and save button', async () => {
    await PersonalAreaPage.scrollDown();
    await expect(MailingTabPage.deleteAccountSectionLabel).toBeDisplayed();
    await expect(MailingTabPage.deleteAccountButton).toBeDisplayed();
    await expect(MailingTabPage.saveChangesButton).toBeDisplayed();
  });

  it('should have correct default toggle states', async () => {
    expect(await MailingTabPage.emailMailingToggle.getAttribute('checked')).toBe('false');
    expect(await MailingTabPage.smsMailingToggle.getAttribute('checked')).toBe('false');
    expect(await MailingTabPage.whatsappMailingToggle.getAttribute('checked')).toBe('false');
    expect(await MailingTabPage.appNotificationsToggle.getAttribute('checked')).toBe('true');
  });

  it('should keep save button enabled when toggling email mailing', async () => {
    await MailingTabPage.emailMailingToggle.click();
    await driver.pause(500);
    expect(await MailingTabPage.saveChangesButton.getAttribute('enabled')).toBe('true');
    await MailingTabPage.emailMailingToggle.click();
    await driver.pause(500);
    expect(await MailingTabPage.saveChangesButton.getAttribute('enabled')).toBe('true');
  });

  it('should delete the account successfully', async () => {
    await PersonalAreaPage.navigateToDeleteAccount();
    await DeleteAccountPage.waitForScreen();
    await DeleteAccountPage.tapContinue();
    await DeleteAccountPage.waitForSuccessDialog();
    await DeleteAccountPage.tapGoHome();
    await HomePage.waitForScreen();
  });
});
