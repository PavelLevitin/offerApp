const { expect: chaiExpect } = require('chai');

/**
 * Custom assertion helpers.
 * Use these for reusable, descriptive assertions across test specs.
 */

/**
 * Assert an element is visible with a clear bug-report-friendly message.
 */
async function assertElementVisible(element, elementName) {
  await element.waitForDisplayed({ timeout: 15000 });
  await expect(element).toBeDisplayed();
  console.log(`✓ ${elementName} is visible`);
}

/**
 * Assert an element is NOT visible.
 */
async function assertElementNotVisible(element, elementName) {
  await expect(element).not.toBeDisplayed();
  console.log(`✓ ${elementName} is not visible`);
}

/**
 * Assert exact text on an element.
 */
async function assertExactText(element, expectedText, elementName) {
  await element.waitForDisplayed({ timeout: 15000 });
  await expect(element).toHaveText(expectedText);
  console.log(`✓ ${elementName} has text: "${expectedText}"`);
}

/**
 * Assert element text contains a substring (case-sensitive).
 */
async function assertTextContains(element, partialText, elementName) {
  await element.waitForDisplayed({ timeout: 15000 });
  const actualText = await element.getText();
  chaiExpect(actualText, `${elementName} text`).to.include(partialText);
  console.log(`✓ ${elementName} contains text: "${partialText}"`);
}

/**
 * Assert a list has the expected number of items.
 */
async function assertListLength(elements, expectedLength, listName) {
  const items = await elements;
  chaiExpect(items, listName).to.have.lengthOf(expectedLength);
  console.log(`✓ ${listName} has ${expectedLength} items`);
}

/**
 * Assert navigation to a new screen by checking a unique element.
 */
async function assertNavigatedTo(screenElement, screenName) {
  await screenElement.waitForDisplayed({ timeout: 20000 });
  await expect(screenElement).toBeDisplayed();
  console.log(`✓ Navigated to: ${screenName}`);
}

/**
 * Assert an error message is shown with specific text.
 */
async function assertErrorShown(errorElement, expectedMessage) {
  await errorElement.waitForDisplayed({ timeout: 10000 });
  await expect(errorElement).toBeDisplayed();
  await expect(errorElement).toHaveText(expectedMessage);
  console.log(`✓ Error shown: "${expectedMessage}"`);
}

/**
 * Assert element is enabled (interactive).
 */
async function assertEnabled(element, elementName) {
  await expect(element).toBeEnabled();
  console.log(`✓ ${elementName} is enabled`);
}

/**
 * Assert element is disabled (not interactive).
 */
async function assertDisabled(element, elementName) {
  await expect(element).toBeDisabled();
  console.log(`✓ ${elementName} is disabled`);
}

module.exports = {
  assertElementVisible,
  assertElementNotVisible,
  assertExactText,
  assertTextContains,
  assertListLength,
  assertNavigatedTo,
  assertErrorShown,
  assertEnabled,
  assertDisabled,
};
