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




import twilio from 'twilio';

class TwilioWhatsAppService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;
    
    if (this.accountSid && this.authToken) {
      this.client = twilio(this.accountSid, this.authToken);
    } else {
      console.log('❌ Twilio Credentials Missing in process.env');
    }
  }

  async sendMessage(to, body) {
    try {
      if (!this.client) {
        console.log('⚠️ Twilio not initialized - Check Render Env Vars');
        return { sid: 'test-mode' };
      }

      // 1. Format 'FROM' number (Render-la prefix irundhaalum illatiyum handle pannum)
      let fromNumber = this.whatsappNumber;
      if (!fromNumber.startsWith('whatsapp:')) {
        fromNumber = `whatsapp:${fromNumber}`;
      }

      // 2. Format 'TO' number
      // To ensure it always has 'whatsapp:+' format
      let formattedTo = to;
      if (!formattedTo.startsWith('whatsapp:')) {
        formattedTo = formattedTo.startsWith('+') ? `whatsapp:${formattedTo}` : `whatsapp:+${formattedTo}`;
      }
      
      console.log(`📨 Attempting to send FROM: ${fromNumber} TO: ${formattedTo}`);

      const message = await this.client.messages.create({
        from: fromNumber,
        to: formattedTo,
        body: body
      });

      console.log(`✅ WhatsApp sent: ${message.sid}`);
      return message;
    } catch (error) {
      console.error('❌ Twilio API Error:', error.message);
      return { sid: 'error', error: error.message };
    }
  }

  formatPhone(phone) {
    if (!phone) return null;
    // Numbers-a mattum clean pannum
    const cleaned = phone.replace(/\D/g, '');
    // 10 digit number-na +91 add pannum, illana + mattum add pannum
    return cleaned.length === 10 ? `+91${cleaned}` : `+${cleaned}`;
  }
}

export default new TwilioWhatsAppService();