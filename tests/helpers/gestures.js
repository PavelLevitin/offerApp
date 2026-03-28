/**
 * Gesture helpers — reusable mobile-specific interactions.
 */

async function swipe(startX, startY, endX, endY, duration = 800) {
  await driver.touchAction([
    { action: 'press',  x: startX, y: startY },
    { action: 'wait',   ms: duration },
    { action: 'moveTo', x: endX,   y: endY },
    { action: 'release' },
  ]);
}

async function swipeScreenLeft() {
  const { width, height } = await driver.getWindowSize();
  await swipe(width * 0.8, height / 2, width * 0.2, height / 2);
}

async function swipeScreenRight() {
  const { width, height } = await driver.getWindowSize();
  await swipe(width * 0.2, height / 2, width * 0.8, height / 2);
}

async function swipeScreenUp() {
  const { width, height } = await driver.getWindowSize();
  await swipe(width / 2, height * 0.8, width / 2, height * 0.2);
}

async function swipeScreenDown() {
  const { width, height } = await driver.getWindowSize();
  await swipe(width / 2, height * 0.2, width / 2, height * 0.8);
}

async function tapByCoordinates(x, y) {
  await driver.touchAction({ action: 'tap', x, y });
}

async function longPress(element, duration = 2000) {
  await driver.touchAction([
    { action: 'longPress', element, ms: duration },
    { action: 'release' },
  ]);
}

async function pinchToZoom(element, scale = 0.5) {
  await driver.execute('mobile: pinchOpenGesture', {
    elementId: element.elementId,
    scale,
    velocity: 1.0,
  });
}

module.exports = {
  swipe,
  swipeScreenLeft,
  swipeScreenRight,
  swipeScreenUp,
  swipeScreenDown,
  tapByCoordinates,
  longPress,
  pinchToZoom,
};
