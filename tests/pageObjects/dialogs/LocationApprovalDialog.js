/**
 * LocationApprovalDialog
 *
 * In-app dialog that appears when the user taps the "sort by location" button
 * on the Welcome screen. This is an app-level dialog (not a system dialog).
 * Elements use accessibility IDs (content-desc).
 *
 * Title:   "אישור מיקום"
 * Buttons: "המשך" (Continue) | "ביטול" (Cancel)
 */
class LocationApprovalDialog {

  get title() {
    return $('~אישור מיקום');
  }

  get continueButton() {
    return $('~המשך');
  }

  get cancelButton() {
    return $('~ביטול');
  }

  async isDisplayed() {
    return this.title.isDisplayed().catch(() => false);
  }

  async continue() {
    await this.continueButton.waitForDisplayed({ timeout: 5000 });
    await this.continueButton.click();
  }

  async cancel() {
    await this.cancelButton.waitForDisplayed({ timeout: 5000 });
    await this.cancelButton.click();
  }

}

module.exports = new LocationApprovalDialog();
