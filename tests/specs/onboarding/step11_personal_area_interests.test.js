const PersonalAreaPage = require('../../pageObjects/PersonalAreaPage');
const sessionData      = require('../../data/sessionData');
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
  completePersonalAreaDetailsHappyPath,
  deleteAccount,
} = require('./helpers');

describe('Fresh Onboarding — Step 11: Personal Area: interests tab', () => {
  before(async () => {
    await goToWelcomeScreen();
    await goThroughMallSelection();
    await navigateToPhoneEntry();
    await submitPhone();
    await waitAndEnterOTP();
    await completeRegistrationFormHappyPath();
    await completeImportantDatesHappyPath();
    await completeCategoriesHappyPath();
    await completePersonalAreaDetailsHappyPath();
    await navigateToPersonalArea('interestsTab');
  });

  it('should show categories selected during onboarding as selected', async () => {
    for (const category of sessionData.categories) {
      const normalized = category.split('\n')[0].trim();
      const chip = $(`//android.widget.Button[contains(@content-desc, "${normalized}") and @selected="true"]`);
      await expect(chip).toExist();
    }
  });

  it('should show stores selected during onboarding as selected', async () => {
    await PersonalAreaPage.scrollDown();
    await PersonalAreaPage.scrollDown();
    for (const store of sessionData.stores) {
      const normalized = store.split('\n')[0].trim();
      const chip = $(`//android.widget.ImageView[contains(@content-desc, "${normalized}") and @selected="true"]`);
      await expect(chip).toExist();
    }

    await deleteAccount();
  });
});
