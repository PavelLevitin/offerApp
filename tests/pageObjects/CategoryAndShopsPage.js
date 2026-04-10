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
    const chips = await $$(this._chipXpath);
    const result = [];

    for (let i = 0; i < chips.length; i++) {
      const desc = await chips[i].getAttribute('content-desc');
      // content-desc format is "<name>\n<name>" — take the first part
      const name = desc.split('\n')[0].trim();
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

    // ── 1 & 2: reveal all chips and build the dynamic array ──────────────────
    await this.scrollToRevealAllChips();
    await this.buildChipArray();

    // ── 3: tap first two categories by position ──────────────────────────────
    const cats = await $$(this._chipXpath);
    console.log(`[CategoryAndShopsPage] cats found: ${cats.length}`);

    this.selectedCategories.push(await cats[0].getAttribute('content-desc'));
    console.log(`[CategoryAndShopsPage] tapping cat[0]: ${this.selectedCategories[0]}`);
    await cats[0].click();
    await driver.pause(300);

    if (cats.length > 1) {
      this.selectedCategories.push(await cats[1].getAttribute('content-desc'));
      console.log(`[CategoryAndShopsPage] tapping cat[1]: ${this.selectedCategories[1]}`);
      await cats[1].click();
      await driver.pause(300);
    }

    // ── 4: scroll all the way down to reveal the stores section ──────────────
    await driver.pause(1000);
    for (let i = 0; i < 3; i++) {
      await driver.action('pointer', {
        type: 'pointer', id: 'finger1',
        parameters: { pointerType: 'touch' },
      })
        .move({ duration: 0, x: 540, y: 1500 })
        .down({ button: 0 })
        .move({ duration: 800, x: 540, y: 300 })
        .up({ button: 0 })
        .perform();
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
