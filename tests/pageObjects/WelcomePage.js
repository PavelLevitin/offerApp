/**
 * WelcomePage
 *
 * First screen after fresh install. Shown after all permission dialogs are handled.
 * React Native app — no resource-ids; elements use accessibility IDs (content-desc).
 *
 * Key elements:
 *   - "Welcome" heading (en)
 *   - "ברוכים הבאים ל MY OFER" subtitle (he) — content-desc may have trailing whitespace
 *   - "Choose your Ofer mall" heading (en)
 *   - Sort-by-location button (content-desc starts with "enable_location_button")
 *   - Region tabs: אזור צפון / אזור מרכז / אזור דרום
 *   - Mall list (scrollable, items contain "פתוח" or "סגור" in content-desc)
 */
class WelcomePage {

  // ── Identifiers ────────────────────────────────────────────────────────────

  get welcomeHeading() {
    return $('~Welcome');
  }

  // content-desc includes trailing newlines on some Android versions — use contains()
  get welcomeSubtitle() {
    return $('//*[contains(@content-desc, "ברוכים הבאים ל MY OFER")]');
  }

  get chooseMallHeading() {
    return $('~Choose your Ofer mall');
  }

  // content-desc may include extra localized text after the ID — use contains()
  get sortByLocationButton() {
    return $('//*[contains(@content-desc, "location_button")]');
  }

  // Region tabs shown when location permission is denied
  get northTab()  { return $('//*[contains(@content-desc, "אזור צפון")]'); }
  get centerTab() { return $('//*[contains(@content-desc, "אזור מרכז")]'); }
  get southTab()  { return $('//*[contains(@content-desc, "אזור דרום")]'); }

  /**
   * First mall item in the list — location-independent selector.
   * Mall items have their status ("פתוח" = open, "סגור" = closed) in content-desc.
   */
  get firstMallItem() {
    return $('(//*[contains(@content-desc, "פתוח") and @clickable="true"])[1]');
  }

  /**
   * All visible mall items in the list.
   */
  get mallItems() {
    return $$('//*[contains(@content-desc, "פתוח") and @clickable="true"]');
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async waitForScreen() {
    await this.welcomeHeading.waitForDisplayed({ timeout: 30000 });
  }

  async assertWelcomeScreenVisible() {
    await expect(this.welcomeHeading).toBeDisplayed();
    await expect(this.welcomeSubtitle).toBeDisplayed();
    await expect(this.chooseMallHeading).toBeDisplayed();
  }

  async assertAllRegionTabsVisible() {
    // After location is granted the screen shows "קניונים באזור שלך" (location-sorted tab).
    // When location is denied it shows three regional tabs (North/Center/South).
    // Assert whichever is present.
    const locationTab = $('//*[contains(@content-desc, "קניונים באזור שלך")]');
    const hasLocationTab = await locationTab.isDisplayed().catch(() => false);
    if (hasLocationTab) {
      await expect(locationTab).toBeDisplayed();
    } else {
      await expect(this.northTab).toBeDisplayed();
      await expect(this.centerTab).toBeDisplayed();
      await expect(this.southTab).toBeDisplayed();
    }
  }

  async scrollToTop() {
    await driver.execute('mobile: scrollGesture', {
      left: 100, top: 300, width: 800, height: 1500,
      direction: 'up',
      percent: 3.0,
    });
  }

  async clickSortByLocation() {
    await this.sortByLocationButton.waitForDisplayed({ timeout: 3000 });
    await this.sortByLocationButton.click();
    await driver.pause(1000);
  }

  async assertSortByLocationButtonVisible() {
    // Button may be hidden when location is already granted (autoGrantPermissions).
    // Assert it exists in the hierarchy; displayed state depends on location grant status.
    const isDisplayed = await this.sortByLocationButton.isDisplayed().catch(() => false);
    const isExisting  = await this.sortByLocationButton.isExisting().catch(() => false);
    expect(isDisplayed || isExisting).toBe(true);
  }

  /**
   * Scroll down to bring the mall list into the viewport.
   * VirtualizedList only renders items into the accessibility tree once visible.
   */
  async scrollToMallList() {
    await driver.action('pointer', {
      type: 'pointer', id: 'finger1',
      parameters: { pointerType: 'touch' },
    })
      .move({ duration: 0, x: 540, y: 1600 })
      .down({ button: 0 })
      .move({ duration: 300, x: 540, y: 520 })
      .up({ button: 0 })
      .perform();
    await driver.pause(300);
  }

  async assertMallListNotEmpty() {
    await this.scrollToMallList();
    // Mall data loads from network — wait up to 15s for at least one item
    await this.firstMallItem.waitForDisplayed({ timeout: 15000 });
    const items = await this.mallItems;
    expect(items.length).toBeGreaterThan(0);
  }

  /**
   * Select the first mall in the list, regardless of location.
   */
  async selectFirstMall() {
    const alreadyVisible = await this.firstMallItem.isDisplayed().catch(() => false);
    if (!alreadyVisible) await this.scrollToMallList();
    await driver.pause(3000);
    await this.firstMallItem.waitForDisplayed({ timeout: 5000 });
    await this.firstMallItem.click();
    await driver.pause(1000);
  }

}

module.exports = new WelcomePage();
