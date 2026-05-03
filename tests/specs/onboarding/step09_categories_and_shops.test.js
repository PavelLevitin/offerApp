const CategoryAndShopsPage = require('../../pageObjects/CategoryAndShopsPage');
const {
  goToWelcomeScreen,
  goThroughMallSelection,
  navigateToPhoneEntry,
  submitPhone,
  waitAndEnterOTP,
  completeRegistrationFormHappyPath,
  completeImportantDatesHappyPath,
  completeCategoriesHappyPath,
  deleteAccount,
} = require('./helpers');

describe('Fresh Onboarding — Step 9: Categories and shops', () => {
  before(async () => {
    await goToWelcomeScreen();
    await goThroughMallSelection();
    await navigateToPhoneEntry();
    await submitPhone();
    await waitAndEnterOTP();
    await completeRegistrationFormHappyPath();
    await completeImportantDatesHappyPath();
  });

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
