const twilio = require('twilio');

class TwilioService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
  }

  /**
   * Send SMS notification
   * @param {string} to - Recipient phone number
   * @param {string} message - Message content
   * @returns {Promise} - Twilio message response
   */
  async sendSMS(to, message) {
    try {
      const response = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: to,
      });
      
      console.log(`SMS sent successfully. SID: ${response.sid}`);
      return response;
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  }

  /**
   * Send donation confirmation SMS
   * @param {string} phoneNumber - Donor's phone number
   * @param {Object} donationDetails - Donation information
   */
  async sendDonationConfirmation(phoneNumber, donationDetails) {
    const message = `Thank you for your generous donation of ₹${donationDetails.amount} to Culture Heritage Preservation! Your contribution helps preserve our cultural heritage. Receipt ID: ${donationDetails.receiptNumber}`;
    
    return this.sendSMS(phoneNumber, message);
  }

  /**
   * Send welcome SMS to new users
   * @param {string} phoneNumber - User's phone number
   * @param {string} userName - User's name
   */
  async sendWelcomeSMS(phoneNumber, userName) {
    const message = `Welcome to Culture Heritage Preservation, ${userName}! Thank you for joining our mission to preserve and protect our invaluable cultural heritage.`;
    
    return this.sendSMS(phoneNumber, message);
  }

  /**
   * Send heritage site approval notification
   * @param {string} phoneNumber - Contributor's phone number
   * @param {Object} siteDetails - Approved site information
   */
  async sendSiteApprovalNotification(phoneNumber, siteDetails) {
    const message = `Great news! Your heritage site contribution "${siteDetails.name}" has been approved and is now live on our platform. Thank you for helping preserve our cultural heritage!`;
    
    return this.sendSMS(phoneNumber, message);
  }

  /**
   * Send password reset SMS
   * @param {string} phoneNumber - User's phone number
   * @param {string} resetToken - Password reset token
   */
  async sendPasswordResetSMS(phoneNumber, resetToken) {
    const message = `Your Culture Heritage password reset code is: ${resetToken}. This code will expire in 10 minutes. If you didn't request this, please ignore this message.`;
    
    return this.sendSMS(phoneNumber, message);
  }

  /**
   * Send verification code for phone verification
   * @param {string} phoneNumber - User's phone number
   * @param {string} verificationCode - 6-digit verification code
   */
  async sendVerificationCode(phoneNumber, verificationCode) {
    const message = `Your Culture Heritage verification code is: ${verificationCode}. This code will expire in 5 minutes. Please enter it to verify your phone number.`;
    
    return this.sendSMS(phoneNumber, message);
  }

  /**
   * Send notification about new heritage sites in user's area
   * @param {string} phoneNumber - User's phone number
   * @param {Array} newSites - Array of new heritage sites
   * @param {string} userLocation - User's location
   */
  async sendNearbySitesNotification(phoneNumber, newSites, userLocation) {
    const siteNames = newSites.map(site => site.name).join(', ');
    const message = `New heritage sites added near ${userLocation}: ${siteNames}. Explore these cultural treasures on Culture Heritage Preservation!`;
    
    return this.sendSMS(phoneNumber, message);
  }

  /**
   * Send donation reminder for recurring donations
   * @param {string} phoneNumber - Donor's phone number
   * @param {Object} donationDetails - Recurring donation information
   */
  async sendRecurringDonationReminder(phoneNumber, donationDetails) {
    const message = `Your recurring donation of ₹${donationDetails.amount} to Culture Heritage Preservation will be processed tomorrow. Thank you for your continued support in preserving our cultural heritage!`;
    
    return this.sendSMS(phoneNumber, message);
  }

  /**
   * Send emergency alerts about heritage sites
   * @param {Array} phoneNumbers - List of phone numbers to notify
   * @param {Object} alertDetails - Emergency alert information
   */
  async sendEmergencyAlert(phoneNumbers, alertDetails) {
    const message = `🚨 EMERGENCY ALERT: ${alertDetails.message}. Site: ${alertDetails.siteName}. Please avoid the area until further notice. Heritage Preservation Team`;
    
    // Send to all phone numbers
    const promises = phoneNumbers.map(phone => this.sendSMS(phone, message));
    return Promise.allSettled(promises);
  }

  /**
   * Verify phone number format
   * @param {string} phoneNumber - Phone number to validate
   * @returns {boolean} - True if valid format
   */
  validatePhoneNumber(phoneNumber) {
    // Basic validation for Indian phone numbers
    const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
    return phoneRegex.test(phoneNumber.replace(/[\s\-\(\)]/g, ''));
  }

  /**
   * Format phone number to E.164 format
   * @param {string} phoneNumber - Phone number to format
   * @returns {string} - Formatted phone number
   */
  formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add +91 prefix if not present and number is 10 digits
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }
    
    // Add + prefix if missing
    if (cleaned.startsWith('91') && !cleaned.startsWith('+')) {
      return `+${cleaned}`;
    }
    
    return phoneNumber;
  }
}

module.exports = new TwilioService();
