/**
 * CategoryAndShopsPage
 *
 * "מה מעניין אותך?" + "ובאילו חנויות?" — categories & shops selection (step 3 of registration).
 * React Native app — elements use accessibility IDs (content-desc).
 *
 * Key elements:
 *   - Back button              (~back_icon_button)
 *   - Category chips           (contains @content-desc)  — optional, multi-select
 *   - Store search field       (contains "יש לך חנות")   — optional
 *   - Store chips              (contains @content-desc)  — optional, multi-select
 *   - Continue / Join button   — label changes based on state:
 *       · Categories shown, stores NOT shown → "המשך"
 *       · Categories shown, stores shown     → "הצטרפות"
 *   - Complete later link      (contains "השלם מאוחר יותר")
 *
 * Notes:
 *   - All selections are optional
 *   - Category chip content-desc format: "<name>\n<name>" (name repeated)
 *   - Store chip content-desc format: "<name>\n<name>" (name repeated)
 *   - Page is scrollable — stores section is below the fold
 */
class CategoryAndShopsPage {

  get backButton() {
    return $('~back_icon_button');
  }

  // ── Category chips ────────────────────────────────────────────────────────

  get shoppingUpTo40() {
    return $('//*[contains(@content-desc, "שופינג עד 40")]');
  }

  get seasonalEvents() {
    return $('//*[contains(@content-desc, "עונת האירועים")]');
  }

  get clothingAndFootwear() {
    return $('//*[contains(@content-desc, "ביגוד והנעלה")]');
  }

  get kidsAndBabies() {
    return $('//*[contains(@content-desc, "ילדים ותינוקות")]');
  }

  get homeAndGarden() {
    return $('//*[contains(@content-desc, "לבית ולגן")]');
  }

  get cosmeticsAndBeauty() {
    return $('//*[contains(@content-desc, "קוסמטיקה")]');
  }

  get restaurantsAndCafes() {
    return $('//*[contains(@content-desc, "מסעדות ובתי קפה")]');
  }

  get electronicsAndAppliances() {
    return $('//*[contains(@content-desc, "חשמל ואלקטרוניקה")]');
  }

  get additionalServices() {
    return $('//*[contains(@content-desc, "שירותים נוספים")]');
  }

  get miscellaneous() {
    return $('//*[contains(@content-desc, "שונות")]');
  }

  get optics() {
    return $('//*[contains(@content-desc, "אופטיקה")]');
  }

  get bagsAndJewelry() {
    return $('//*[contains(@content-desc, "תיקים, תכשיטים")]');
  }

  get booksAndGifts() {
    return $('//*[contains(@content-desc, "ספרים, מתנות")]');
  }

  get sportsAndTravel() {
    return $('//*[contains(@content-desc, "ספורט וטיולים")]');
  }

  // ── Stores section ────────────────────────────────────────────────────────

  get storeSearchField() {
    return $('//*[contains(@content-desc, "יש לך חנות")]');
  }

  get myoferStore() {
    return $('//*[contains(@content-desc, "myofer")]');
  }

  get migdalOferStore() {
    return $('//*[contains(@content-desc, "מגדל עופר")]');
  }

  get marketAndChainsStore() {
    return $('//*[contains(@content-desc, "מרקט ורשתות מזון")]');
  }

  // ── Continue / Join button ────────────────────────────────────────────────
  //
  // The button label changes based on state:
  //   - "המשך"      → categories selected, stores section not yet shown
  //   - "הצטרפות"   → stores section is visible (after scrolling or selecting a category)
  //
  // For the happy flow, use continueOrJoinButton which matches whichever is active.

  get continueButton() {
    return $('~המשך');
  }

  get joinButton() {
    return $('~הצטרפות');
  }

  get completeLaterButton() {
    return $('//*[contains(@content-desc, "השלם מאוחר יותר")]');
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  async waitForScreen() {
    await $('//*[contains(@content-desc, "מה מעניין אותך")]').waitForDisplayed({ timeout: 15000 });
  }

  async assertScreenVisible() {
    await expect($('//*[contains(@content-desc, "מה מעניין אותך")]')).toBeDisplayed();
    await expect(this.completeLaterButton).toBeDisplayed();
  }

  // XPath that matches category chip elements, excluding action buttons
  get _chipXpath() {
    return (
      '//*[@clickable="true" ' +
      'and not(contains(@content-desc, "back_icon")) ' +
      'and not(contains(@content-desc, "השלם")) ' +
      'and not(contains(@content-desc, "הצטרפות")) ' +
      'and not(contains(@content-desc, "המשך"))]'
    );
  }

  /**
   * Scrolls down until the chip count stabilises (no new chips appear after
   * two consecutive scroll attempts), ensuring all category chips are visible.
   */
  async scrollToRevealAllChips() {
    let prevCount = 0;
    let stableRounds = 0;

    while (stableRounds < 2) {
      const chips = await $$(this._chipXpath);
      if (chips.length === prevCount) {
        stableRounds++;
      } else {
        prevCount = chips.length;
        stableRounds = 0;
      }
      if (stableRounds >= 2) break;
      await this.scrollDown();
    }
  }

  /**
   * Discovers all category chips currently on screen and returns a dynamic
   * array of { index, selector } objects — one per chip.
   *
   * The selector is content-desc–based so it works regardless of chip order or
   * count, which can vary per mall and over time.
   *
   * Result is also stored as this.chipArray for later reference.
   *
   * Example:
   *   [
   *     { index: 0, selector: '//*[contains(@content-desc, "עונת האירועים")]' },
   *     { index: 1, selector: '//*[contains(@content-desc, "שופינג עד 40 ₪")]' },
   *     ...
   *   ]
   */
  async buildChipArray() {
    // Determine the Y position of the "ובאילו חנויות?" heading so we can
    // keep only chips that appear ABOVE it (i.e. category chips, not stores).
    // Using bounds comparison avoids the following:: axis predicate which
    // crashes the Android XPath processor.
    let headingY = Infinity;
    const headings = await $$('//*[contains(@content-desc, "ובאילו חנויות")]');
    if (headings.length > 0) {
      const hBounds = await headings[0].getAttribute('bounds');
      const hMatch = hBounds && hBounds.match(/\[(\d+),(\d+)\]/);
      if (hMatch) headingY = parseInt(hMatch[2], 10); // top-Y of heading
    }

    const chips = await $$(this._chipXpath);
    const result = [];

    for (let i = 0; i < chips.length; i++) {
      // Skip chips whose top-Y is at or below the heading
      const bounds = await chips[i].getAttribute('bounds');
      const bMatch = bounds && bounds.match(/\[(\d+),(\d+)\]/);
      if (bMatch && parseInt(bMatch[2], 10) >= headingY) continue;

      const desc = await chips[i].getAttribute('content-desc');
      // skip elements with null or empty content-desc
      if (!desc) continue;
      // content-desc format is "<name>\n<name>" — take the first part
      const name = desc.split('\n')[0].trim();
      if (!name) continue;
      result.push({
        index: i,
        selector: `//*[contains(@content-desc, "${name}")]`,
      });
    }

    console.log(`[CategoryAndShopsPage] chipArray built: ${result.length} chips`);
    result.forEach(({ index, selector }) => console.log(`  [${index}] ${selector}`));

    this.chipArray = result;
    return result;
  }

  /**
   * Full happy-path registration completion:
   *   1. Scroll until all category chips are visible
   *   2. Build chipArray — [{index, selector}] for each chip
   *   3. Tap the 1st and 2nd chips from the array
   *   4. Scroll to the bottom so the stores section is visible
   *   5. Tap the 1st store chip; tap the 2nd if one exists
   *   6. Tap הצטרפות
   *
   * Selected names are saved to this.selectedCategories / this.selectedStores
   * so later tests/assertions can reference exactly what was chosen.
   */
  async selectCategoryAndJoin() {
    this.selectedCategories = [];
    this.selectedStores     = [];

    // ── 1: scroll to top so category chips are stable and visible ────────────
    await this.scrollToCategoriesSection();
    await driver.pause(500);

    // ── 2: tap first two categories — re-fetch before each click ─────────────
    const cats0 = await $$(this._chipXpath);
    console.log(`[CategoryAndShopsPage] cats found: ${cats0.length}`);

    if (cats0.length > 0) {
      this.selectedCategories.push(await cats0[0].getAttribute('content-desc'));
      console.log(`[CategoryAndShopsPage] tapping cat[0]: ${this.selectedCategories[0]}`);
      await cats0[0].click();
      await driver.pause(500);
    }

    if (cats0.length > 1) {
      // Re-fetch after first click in case DOM updated
      const cats1 = await $$(this._chipXpath);
      this.selectedCategories.push(await cats1[1].getAttribute('content-desc'));
      console.log(`[CategoryAndShopsPage] tapping cat[1]: ${this.selectedCategories[1]}`);
      await cats1[1].click();
      await driver.pause(500);
    }

    // ── 3: scroll all the way down to reveal the stores section ──────────────
    await driver.pause(1000);
    for (let i = 0; i < 3; i++) {
      await this.scrollDown();
      await driver.pause(500);
    }

    // ── 5: tap first two stores by position (one if only one exists) ─────────
    const storeXpath =
      '//*[starts-with(@content-desc, "חנות") and @clickable="true"]';
    const stores = await $$(storeXpath);
    console.log(`[CategoryAndShopsPage] stores found: ${stores.length}`);

    if (stores.length > 0) {
      this.selectedStores.push(await stores[0].getAttribute('content-desc'));
      console.log(`[CategoryAndShopsPage] tapping store[0]: ${this.selectedStores[0]}`);
      await stores[0].click();
      await driver.pause(300);
    }
    if (stores.length > 1) {
      this.selectedStores.push(await stores[1].getAttribute('content-desc'));
      console.log(`[CategoryAndShopsPage] tapping store[1]: ${this.selectedStores[1]}`);
      await stores[1].click();
      await driver.pause(300);
    }

    // ── 6: tap Join ───────────────────────────────────────────────────────────
    console.log('[CategoryAndShopsPage] tapping Join');
    await this.tapJoin();
    await driver.pause(3000);
  }

  async scrollDown() {
    await driver.action('pointer', {
      type: 'pointer', id: 'finger1',
      parameters: { pointerType: 'touch' },
    })
      .move({ duration: 0, x: 540, y: 1400 })
      .down({ button: 0 })
      .move({ duration: 500, x: 540, y: 400 })
      .up({ button: 0 })
      .perform();
    await driver.pause(400);
  }

  async scrollUp() {
    await driver.action('pointer', {
      type: 'pointer', id: 'finger1',
      parameters: { pointerType: 'touch' },
    })
      .move({ duration: 0, x: 540, y: 400 })
      .down({ button: 0 })
      .move({ duration: 500, x: 540, y: 1400 })
      .up({ button: 0 })
      .perform();
    await driver.pause(400);
  }

  /**
   * Scrolls up until the "מה מעניין אותך" heading is displayed.
   * Max 8 attempts.
   */
  async scrollToCategoriesSection() {
    const heading = $('//*[contains(@content-desc, "מה מעניין אותך")]');
    for (let i = 0; i < 8; i++) {
      const displayed = await heading.isDisplayed().catch(() => false);
      if (displayed) return;
      await this.scrollUp();
    }
    await heading.waitForDisplayed({ timeout: 3000 });
  }

  /**
   * Scrolls down until the "ובאילו חנויות?" heading is displayed.
   * Max 5 attempts.
   */
  async scrollToShopsSection() {
    const shopsHeading = $('//*[contains(@content-desc, "ובאילו חנויות")]');
    for (let i = 0; i < 5; i++) {
      const displayed = await shopsHeading.isDisplayed().catch(() => false);
      if (displayed) return;
      await this.scrollDown();
    }
    await shopsHeading.waitForDisplayed({ timeout: 3000 });
  }

  /**
   * Scrolls down through the shops section and returns the total count of
   * unique shop chips. Uses the mall name from content-desc to reliably
   * identify shop chips (each shop chip contains the selected mall name).
   *
   * @param {string} mallName — the mall name captured during registration
   */
  async getShopChips(mallName) {
    console.log(`[CategoryAndShopsPage] getShopChips called with mallName="${mallName}"`);
    const seen = new Set();
    let noNewCount = 0;
    // Scope to ImageView only — shop chips are ImageViews, category chips are Buttons
    const xpath = `//android.widget.ImageView[contains(@content-desc, "${mallName}")]`;
    const noShopsXpath = '//*[contains(@content-desc, "אין חנויות בקטגוריה זו בקניון")]';

    // Allow time for the new category's shops to load before the first check
    await driver.pause(1500);

    for (let i = 0; i < 20; i++) {
      // Check for "no shops in this category" message.
      // Only treat it as genuinely empty if no shop chips exist either
      // (guards against the brief "no shops" flash during loading transitions).
      const noShopsEls = await $$(noShopsXpath);
      if (noShopsEls.length > 0) {
        const visible = await noShopsEls[0].isDisplayed().catch(() => false);
        if (visible) {
          const shopEls = await $$(xpath);
          if (shopEls.length === 0) return 0; // confirmed empty
          // shops exist alongside the message — continue counting
        }
      }

      const els = await $$(xpath);
      if (i === 0) console.log(`[CategoryAndShopsPage] round 0: XPath matched ${els.length} elements`);
      let foundNew = false;
      for (const el of els) {
        const desc = await el.getAttribute('content-desc').catch(() => null);
        if (desc && !seen.has(desc)) {
          seen.add(desc);
          foundNew = true;
          if (i === 0) console.log(`  new chip: "${desc.substring(0, 60)}"`);
        }
      }

      if (!foundNew) {
        noNewCount++;
        if (noNewCount >= 2) break;
      } else {
        noNewCount = 0;
      }

      await this.scrollDown();
      await driver.pause(1200); // extra wait for RecyclerView to re-render after scroll
    }

    return seen.size;
  }

  async countStoresForCategory() {
    const seen = new Set();
    let noNewCount = 0;

    for (let i = 0; i < 15; i++) {
      const storeEls = await $$('//*[starts-with(@content-desc, "חנות") and @clickable="true"]');
      let foundNew = false;
      for (const el of storeEls) {
        const desc = await el.getAttribute('content-desc');
        if (!seen.has(desc)) {
          seen.add(desc);
          foundNew = true;
        }
      }
      if (!foundNew) {
        noNewCount++;
        if (noNewCount >= 2) break;
      } else {
        noNewCount = 0;
      }
      await this.scrollDown();
    }

    return seen.size;
  }

  async tapJoin() {
    await this.joinButton.waitForDisplayed({ timeout: 5000 });
    await this.joinButton.click();
    await driver.pause(1000);
  }

  async tapCompleteLater() {
    await this.completeLaterButton.waitForDisplayed({ timeout: 10000 });
    await this.completeLaterButton.click();
    await driver.pause(1000);
  }

}

module.exports = new CategoryAndShopsPage();
