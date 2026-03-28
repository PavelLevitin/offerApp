/**
 * HomePage
 *
 * Main screen after selecting a mall. React Native app — uses accessibility IDs.
 *
 * Key elements:
 *   - Top bar: mall name, search icon, menu icon
 *   - "במיוחד בשבילך" (Especially for You) section
 *   - Bottom navigation: ראשי | כל ההטבות | אירועים | חנויות
 */
class HomePage {

  // ── Top bar ────────────────────────────────────────────────────────────────

  get searchButton() {
    return $('~search_icon_button');
  }

  get menuButton() {
    return $('~menu_icon_button');
  }

  // ── Content ────────────────────────────────────────────────────────────────

  get especiallyForYouSection() {
    return $('//*[contains(@content-desc, "במיוחד בשבילך")]');
  }

  // ── Bottom navigation ──────────────────────────────────────────────────────

  get homeTab() {
    return $('//*[contains(@content-desc, "ראשי")]');
  }

  get dealsTab() {
    return $('//*[contains(@content-desc, "כל ההטבות")]');
  }

  get eventsTab() {
    return $('//*[contains(@content-desc, "אירועים")]');
  }

  get storesTab() {
    return $('//*[contains(@content-desc, "חנויות")]');
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async waitForScreen() {
    await this.menuButton.waitForDisplayed({ timeout: 20000 });
  }

  async assertHomeScreenVisible() {
    await expect(this.menuButton).toBeDisplayed();
  }

  async assertBottomNavVisible() {
    await expect(this.homeTab).toBeDisplayed();
    await expect(this.dealsTab).toBeDisplayed();
    await expect(this.eventsTab).toBeDisplayed();
    await expect(this.storesTab).toBeDisplayed();
  }

  async assertTopBarVisible() {
    await expect(this.searchButton).toBeDisplayed();
    await expect(this.menuButton).toBeDisplayed();
  }

}

module.exports = new HomePage();
