// backend/test-config.js
import dotenv from 'dotenv';
import TwilioService from './services/twilio.service.js';

dotenv.config();

console.log('\n🔍 ===== CONFIGURATION DEBUG =====');
console.log('📁 Environment variables:');
console.log('   TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? '✅ Set' : '❌ Missing');
console.log('   TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? '✅ Set' : '❌ Missing');
console.log('   TWILIO_WHATSAPP_NUMBER:', process.env.TWILIO_WHATSAPP_NUMBER || '❌ Missing');
console.log('   FRONTEND_URL:', process.env.FRONTEND_URL || '❌ Missing');

console.log('\n📱 Service instance:');
console.log('   WhatsApp Number:', TwilioService.whatsappNumber);
console.log('   Has Client:', !!TwilioService.client);

console.log('\n✅ Expected number: +15559158674');
console.log('❌ Current number:', TwilioService.whatsappNumber);
console.log('🔍 Match:', TwilioService.whatsappNumber === '+15559158674' ? '✅ YES' : '❌ NO');

if (TwilioService.whatsappNumber !== '+15559158674') {
  console.log('\n⚠️ WARNING: Wrong number detected!');
  console.log('📝 Check your .env file for: TWILIO_WHATSAPP_NUMBER=+15559158674');
  console.log('📝 Make sure there are NO spaces, quotes, or extra characters');
}

console.log('================================\n');