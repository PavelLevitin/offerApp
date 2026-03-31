/**
 * Test data used across all specs.
 *
 * Mall names must match exactly the content-desc values in the mall list.
 * The selectMall() method uses startsWith matching so the name alone is enough
 * (without the status suffix like "פתוח עד 22:00").
 */
module.exports = {
  credentials: {
    testPhone: "0570000004",
    testOtp: "951584",
  },
  registration: {
    firstName: "user",
    lastName:  "testing",
    email:     "automation@test.com",
  },
};
