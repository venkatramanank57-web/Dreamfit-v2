// // backend/services/twilio.service.js
// import twilio from 'twilio';

// class TwilioWhatsAppService {
//   constructor() {
//     this.accountSid = process.env.TWILIO_ACCOUNT_SID;
//     this.authToken = process.env.TWILIO_AUTH_TOKEN;
//     this.whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;
    
//     if (this.accountSid && this.authToken) {
//       this.client = twilio(this.accountSid, this.authToken);
//     }
//   }

//   async sendMessage(to, body) {
//     try {
//       if (!this.client) {
//         console.log('⚠️ Twilio not configured - skipping message');
//         console.log('📨 Would send:', body);
//         return { sid: 'test-mode' };
//       }

//       // Format phone number for WhatsApp
//       const formattedTo = to.startsWith('+') ? `whatsapp:${to}` : `whatsapp:+91${to}`;
      
//       const message = await this.client.messages.create({
//         from: `whatsapp:${this.whatsappNumber}`,
//         to: formattedTo,
//         body: body
//       });

//       console.log(`✅ WhatsApp sent to ${to}:`, message.sid);
//       return message;
//     } catch (error) {
//       console.error('❌ Twilio error:', error.message);
//       return { sid: 'error', error: error.message };
//     }
//   }

//   formatPhone(phone) {
//     if (!phone) return null;
//     const cleaned = phone.replace(/\D/g, '');
//     return cleaned.startsWith('91') ? `+${cleaned}` : `+91${cleaned}`;
//   }
// }

// export default new TwilioWhatsAppService();


// backend/services/twilio.service.js
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

class TwilioWhatsAppService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;
    
    console.log('🔧 Twilio Service Initialized:', {
      accountSidExists: !!this.accountSid,
      authTokenExists: !!this.authToken,
      whatsappNumber: this.whatsappNumber || 'Not set',
      isSandbox: this.whatsappNumber?.includes('sandbox') || false
    });
    
    if (this.accountSid && this.authToken && this.whatsappNumber) {
      this.client = twilio(this.accountSid, this.authToken);
      console.log('✅ Twilio client created successfully');
    } else {
      console.warn('⚠️ Twilio not fully configured - missing credentials');
    }
  }

  /**
   * Format phone number to international format
   */
  formatPhone(phone) {
    if (!phone) return null;
    
    // Remove all non-numeric characters
    let cleaned = phone.replace(/\D/g, '');
    
    console.log(`📞 Formatting phone: ${phone} → cleaned: ${cleaned}`);
    
    // If it's a 10-digit number (Indian mobile)
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }
    
    // If it starts with 91 and has 12 digits (India with country code)
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return `+${cleaned}`;
    }
    
    // If it already has country code (starts with +)
    if (phone.startsWith('+')) {
      return phone;
    }
    
    // If it has country code without + (e.g., 919876543210)
    if (cleaned.length > 10) {
      return `+${cleaned}`;
    }
    
    console.warn(`⚠️ Could not format phone number: ${phone}`);
    return null;
  }

  /**
   * Send WhatsApp message
   */
  async sendMessage(to, body) {
    try {
      console.log('\n📱 ===== TWILIO SEND MESSAGE =====');
      console.log(`📤 To: ${to}`);
      console.log(`📝 Message: ${body.substring(0, 50)}...`);
      
      // Check if Twilio is configured
      if (!this.client) {
        console.log('⚠️ Twilio not configured - skipping message');
        console.log('📨 Would send:', body);
        console.log('🔚 ================================\n');
        return { 
          sid: 'test-mode', 
          status: 'simulated',
          message: 'Twilio not configured - test mode'
        };
      }

      if (!this.whatsappNumber) {
        throw new Error('WhatsApp number not configured');
      }

      // Format the phone number
      const formattedPhone = this.formatPhone(to);
      if (!formattedPhone) {
        throw new Error(`Invalid phone number format: ${to}`);
      }

      // Format for WhatsApp
      const from = `whatsapp:${this.whatsappNumber}`;
      const toWhatsApp = `whatsapp:${formattedPhone}`;
      
      console.log(`📞 From (WhatsApp): ${from}`);
      console.log(`📞 To (WhatsApp): ${toWhatsApp}`);

      // Check if it's a sandbox number
      const isSandbox = this.whatsappNumber.includes('sandbox');
      if (isSandbox) {
        console.log('🏖️ Using WhatsApp Sandbox mode');
        console.log('⚠️ Recipient must have joined sandbox with code');
      }

      // Send the message
      const message = await this.client.messages.create({
        from: from,
        to: toWhatsApp,
        body: body
      });

      console.log(`✅ WhatsApp sent successfully!`);
      console.log(`📎 SID: ${message.sid}`);
      console.log(`📊 Status: ${message.status}`);
      console.log(`🔚 ================================\n`);
      
      return {
        success: true,
        sid: message.sid,
        status: message.status,
        to: formattedPhone
      };

    } catch (error) {
      console.error('❌ Twilio error:', error.message);
      
      // Handle specific Twilio errors
      if (error.code === 21211) {
        console.error('❌ Invalid phone number format');
      } else if (error.code === 21408) {
        console.error('❌ This number is not WhatsApp enabled - User must join sandbox');
        console.log('📝 Solution: User needs to send "join <sandbox-code>" to +14155238886');
      } else if (error.code === 30007) {
        console.error('❌ Message exceeds WhatsApp limit (1600 chars)');
      } else if (error.code === 63016) {
        console.error('❌ Twilio account issue - check billing');
      }
      
      console.log('🔚 ================================\n');
      
      return {
        success: false,
        error: error.message,
        code: error.code,
        to: to
      };
    }
  }

  /**
   * Check if a number is valid for WhatsApp
   */
  async checkNumber(to) {
    try {
      const formattedPhone = this.formatPhone(to);
      if (!formattedPhone) {
        return { valid: false, error: 'Invalid format' };
      }

      // You can use Twilio's WhatsApp verification service here
      // This is a placeholder - actual implementation may vary
      console.log(`🔍 Checking number: ${formattedPhone}`);
      
      return {
        valid: true,
        formatted: formattedPhone,
        whatsappEnabled: true // Assume true for now
      };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  /**
   * Get message status
   */
  async getMessageStatus(messageSid) {
    try {
      if (!this.client) {
        throw new Error('Twilio not configured');
      }

      const message = await this.client.messages(messageSid).fetch();
      
      return {
        sid: message.sid,
        status: message.status,
        errorCode: message.errorCode,
        errorMessage: message.errorMessage,
        dateSent: message.dateSent,
        dateCreated: message.dateCreated
      };
    } catch (error) {
      console.error('Error fetching message status:', error);
      return null;
    }
  }
}

export default new TwilioWhatsAppService();