/**
 * typeText — sends text via driver.keys() which triggers React Native onChangeText events.
 * @param {string} text
 */
async function typeText(text) {
  await driver.keys(text.split(''));
}

/**
 * clearField — sends Backspace key N times to clear an active input field.
 * @param {number} count — number of backspace presses (default 50)
 */
async function clearField(count = 50) {
  const keys = Array(count).fill('Backspace');
  await driver.keys(keys);
}

/**
 * scrollDown — swipes finger up to scroll content down (reveal bottom of page).
 * Uses raw pointer action — works on Flutter apps (mobile: scrollGesture does not).
 */
async function scrollDown() {
  await driver.action('pointer', { type: 'pointer', id: 'finger1', parameters: { pointerType: 'touch' } })
    .move({ duration: 0, x: 540, y: 1400 })
    .down({ button: 0 })
    .move({ duration: 800, x: 540, y: 700 })
    .up({ button: 0 })
    .perform();
  await driver.pause(300);
}

module.exports = { typeText, clearField, scrollDown };
