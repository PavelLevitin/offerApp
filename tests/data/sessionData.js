/**
 * sessionData
 *
 * Runtime data collected during the onboarding flow.
 * Populated step-by-step by onboarding.test.js and used by subsequent
 * test suites to verify that the personal area shows the correct details.
 *
 * Fields:
 *   firstName  — entered on RegistrationPage1
 *   lastName   — entered on RegistrationPage1
 *   email      — entered on RegistrationPage1
 *   gender     — selected on RegistrationPage1
 *   birthYear       — selected on ImportantDatesPage
 *   anniversaryYear — selected on ImportantDatesPage (optional)
 *   familyMembers   — array of { name, year } added on ImportantDatesPage
 *   categories      — chip labels selected on CategoryAndShopsPage
 *   stores          — chip labels selected on CategoryAndShopsPage
 */
module.exports = {
  firstName:       null,
  lastName:        null,
  email:           null,
  gender:          null,
  birthYear:       null,
  anniversaryYear: null,
  familyMembers:   [],
  categories:      [],
  stores:          [],
};
