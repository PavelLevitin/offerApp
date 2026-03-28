/**
 * AndroidLocationPermissionDialog
 *
 * System permission dialog from com.google.android.permissioncontroller.
 * Appears on fresh install for location, nearby-devices, and notification permissions.
 * All elements are identified by resource-id (no accessibility IDs on system dialogs).
 */
class AndroidLocationPermissionDialog {

  get permissionMessage() {
    return $('id=com.android.permissioncontroller:id/permission_message');
  }

  get allowButton() {
    return $('id=com.android.permissioncontroller:id/permission_allow_button');
  }

  get denyButton() {
    return $('id=com.android.permissioncontroller:id/permission_deny_button');
  }

  // On second denial Android replaces permission_deny_button with this ID
  get denyAndDontAskAgainButton() {
    return $('id=com.android.permissioncontroller:id/permission_deny_and_dont_ask_again_button');
  }

  // Location-specific: accuracy options
  get precisRadio() {
    return $('id=com.android.permissioncontroller:id/permission_location_accuracy_radio_fine');
  }

  get approximateRadio() {
    return $('id=com.android.permissioncontroller:id/permission_location_accuracy_radio_coarse');
  }

  get whileUsingAppButton() {
    return $('id=com.android.permissioncontroller:id/permission_allow_foreground_only_button');
  }

  get onlyThisTimeButton() {
    return $('id=com.android.permissioncontroller:id/permission_allow_one_time_button');
  }

  async allow() {
    await this.allowButton.waitForDisplayed({ timeout: 5000 });
    await this.allowButton.click();
  }

  async deny() {
    // Android shows permission_deny_button on first ask,
    // permission_deny_and_dont_ask_again_button on subsequent asks.
    const isDenyVisible = await this.denyButton.isDisplayed().catch(() => false);
    if (isDenyVisible) {
      await this.denyButton.click();
    } else {
      await this.denyAndDontAskAgainButton.waitForDisplayed({ timeout: 5000 });
      await this.denyAndDontAskAgainButton.click();
    }
  }

  async allowWhileUsingApp() {
    await this.whileUsingAppButton.waitForDisplayed({ timeout: 5000 });
    await this.whileUsingAppButton.click();
  }

}

module.exports = new AndroidLocationPermissionDialog();
