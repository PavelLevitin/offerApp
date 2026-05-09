/**
 * MailingTabPage
 *
 * "דיוור" tab within the Personal Area screen.
 * React Native app — elements use accessibility IDs (content-desc).
 *
 * Key elements:
 *   - sectionTitleLabel        — mailing section title
 *   - emailMailingToggle       — email mailing toggle
 *   - smsMailingToggle         — SMS mailing toggle
 *   - whatsappMailingToggle    — WhatsApp mailing toggle
 *   - appNotificationsToggle   — app notifications toggle
 *   - deleteAccountSectionLabel — delete account section title
 *   - deleteAccountButton      — delete account button
 *   - saveChangesButton        — save changes button
 */
class MailingTabPage {

  get sectionTitleLabel() {
    return $('//*[contains(@content-desc, "הגדרות דיוור") or contains(@content-desc, "דיוור") and not(@clickable="true")]');
  }

  get emailMailingToggle() {
    return $('//*[contains(@content-desc, "מייל") or contains(@content-desc, "דוא") or contains(@content-desc, "email_mailing")]');
  }

  get smsMailingToggle() {
    return $('//*[contains(@content-desc, "sms") or contains(@content-desc, "SMS") or contains(@content-desc, "sms_mailing")]');
  }

  get whatsappMailingToggle() {
    return $('//*[contains(@content-desc, "whatsapp") or contains(@content-desc, "וואטסאפ") or contains(@content-desc, "whatsapp_mailing")]');
  }

  get appNotificationsToggle() {
    return $('//*[contains(@content-desc, "התראות") or contains(@content-desc, "push") or contains(@content-desc, "app_notifications")]');
  }

  get deleteAccountSectionLabel() {
    return $('//*[contains(@content-desc, "מחיקת חשבון") or contains(@content-desc, "מחק חשבון") and not(@clickable="true")]');
  }

  get deleteAccountButton() {
    return $('//*[contains(@content-desc, "מחק חשבון") or contains(@content-desc, "delete_account") and @clickable="true"]');
  }

  get saveChangesButton() {
    return $('//*[contains(@content-desc, "שמור") or contains(@content-desc, "save") and @clickable="true"]');
  }

}

module.exports = new MailingTabPage();
