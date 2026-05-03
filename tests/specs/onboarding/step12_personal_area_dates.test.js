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
  completePersonalAreaInterestsHappyPath,
  deleteAccount,
} = require('./helpers');

describe('Fresh Onboarding — Step 12: Personal Area: important dates tab', () => {
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
    await completePersonalAreaInterestsHappyPath();
    await navigateToPersonalArea('importantDatesTab');
  });

  it('should display correct birthday from onboarding', async () => {
    const today = new Date();
    const dd    = String(today.getDate()).padStart(2, '0');
    const mm    = String(today.getMonth() + 1).padStart(2, '0');
    const expectedBirthday = `${dd}/${mm}/${sessionData.birthYear}`;
    const birthdayValue = await PersonalAreaPage.birthdayField.$('android.view.View').getAttribute('text');
    expect(birthdayValue).toBe(expectedBirthday);
  });

  it('should display correct anniversary from onboarding', async () => {
    const today = new Date();
    const dd    = String(today.getDate()).padStart(2, '0');
    const mm    = String(today.getMonth() + 1).padStart(2, '0');
    const anniversaryValue = await PersonalAreaPage.anniversaryField.$('android.view.View').getAttribute('text');
    if (sessionData.anniversaryYear) {
      const expectedAnniversary = `${dd}/${mm}/${sessionData.anniversaryYear}`;
      expect(anniversaryValue).toBe(expectedAnniversary);
    } else {
      expect(anniversaryValue).toBeFalsy();
    }
  });

  it('should display correct family member count', async () => {
    await PersonalAreaPage.scrollDown();
    await PersonalAreaPage.scrollDown();
    const removeButtons = await $$('~remove_family_member_button');
    expect(removeButtons.length).toBe(sessionData.familyMembers.length);
  });

  it('should display correct family member names and dates of birth', async () => {
    const today = new Date();
    const dd    = String(today.getDate()).padStart(2, '0');
    const mm    = String(today.getMonth() + 1).padStart(2, '0');

    await PersonalAreaPage.scrollDown();
    await PersonalAreaPage.scrollDown();
    const nameFields = await $$('//*[@hint="שם מלא"]');
    const dobFields  = await $$('//*[contains(@hint, "תאריך לידה")]');

    const displayedNames = [];
    for (let i = 0; i < nameFields.length; i++) {
      displayedNames.push(await nameFields[i].$('android.widget.EditText').getText());
    }
    const displayedDobs = [];
    for (let i = 0; i < dobFields.length; i++) {
      displayedDobs.push(await dobFields[i].$('android.view.View').getAttribute('text'));
    }

    for (const member of sessionData.familyMembers) {
      expect(displayedNames).toContain(member.name);
      const expectedDob = `${dd}/${mm}/${member.year.slice(-2)}`;
      expect(displayedDobs).toContain(expectedDob);
    }

    await deleteAccount();
  });
});
