// // backend/controllers/whatsapp.controller.js
// import TwilioService from '../services/twilio.service.js';
// import { MESSAGES } from '../utils/messageTemplates.js';
// import Order from '../models/Order.js';
// import Garment from '../models/Garment.js';

// // 📦 1. Send Order Confirmation
// export const sendOrderConfirmation = async (orderId) => {
//   try {
//     console.log(`📨 Sending order confirmation for: ${orderId}`);
    
//     const order = await Order.findById(orderId)
//       .populate('customer')
//       .populate('garments');

//     if (!order) {
//       console.log('❌ Order not found');
//       return;
//     }

//     const customer = order.customer;
    
//     // Get phone number (prefer whatsappNumber, fallback to phone)
//     const phoneNumber = customer.whatsappNumber || customer.phone;
//     const phone = TwilioService.formatPhone(phoneNumber);

//     if (!phone) {
//       console.log('⚠️ Customer has no phone number');
//       return;
//     }

//     const message = MESSAGES.ORDER_CONFIRMED(order, customer);
//     const result = await TwilioService.sendMessage(phone, message);
    
//     console.log(`✅ Order confirmation sent for ${order.orderId}`);
//     return result;

//   } catch (error) {
//     console.error('❌ Error sending order confirmation:', error.message);
//   }
// };

// // 💰 2. Send Payment Received
// export const sendPaymentReceived = async (orderId, payment) => {
//   try {
//     console.log(`📨 Sending payment confirmation for: ${orderId}`);
    
//     const order = await Order.findById(orderId)
//       .populate('customer');

//     if (!order) {
//       console.log('❌ Order not found');
//       return;
//     }

//     const customer = order.customer;
//     const phoneNumber = customer.whatsappNumber || customer.phone;
//     const phone = TwilioService.formatPhone(phoneNumber);

//     if (!phone) {
//       console.log('⚠️ Customer has no phone number');
//       return;
//     }

//     const message = MESSAGES.PAYMENT_RECEIVED(order, customer, payment);
//     const result = await TwilioService.sendMessage(phone, message);
    
//     console.log(`✅ Payment confirmation sent for ${order.orderId}`);
//     return result;

//   } catch (error) {
//     console.error('❌ Error sending payment confirmation:', error.message);
//   }
// };

// // 🚚 3. Send Ready to Deliver
// export const sendReadyToDeliver = async (orderId, garmentId) => {
//   try {
//     console.log(`📨 Sending ready to deliver for: ${orderId}, garment: ${garmentId}`);
    
//     const order = await Order.findById(orderId)
//       .populate('customer');

//     const garment = await Garment.findById(garmentId);

//     if (!order || !garment) {
//       console.log('❌ Order or garment not found');
//       return;
//     }

//     const customer = order.customer;
//     const phoneNumber = customer.whatsappNumber || customer.phone;
//     const phone = TwilioService.formatPhone(phoneNumber);

//     if (!phone) {
//       console.log('⚠️ Customer has no phone number');
//       return;
//     }

//     const message = MESSAGES.READY_FOR_DELIVERY(order, customer, garment);
//     const result = await TwilioService.sendMessage(phone, message);
    
//     console.log(`✅ Ready to deliver sent for ${order.orderId}`);
//     return result;

//   } catch (error) {
//     console.error('❌ Error sending ready to deliver:', error.message);
//   }
// };











// backend/controllers/whatsapp.controller.js
import TwilioService from '../services/twilio.service.js';
import { MESSAGES } from '../utils/messageTemplates.js';
import Order from '../models/Order.js';

// 📦 1. Send Order Confirmation (when order is created)
export const sendOrderConfirmation = async (orderId) => {
  try {
    console.log(`📨 Sending order confirmation for: ${orderId}`);
    
    const order = await Order.findById(orderId)
      .populate('customer')
      .populate('garments');

    if (!order) {
      console.log('❌ Order not found');
      return;
    }

    const customer = order.customer;
    const phoneNumber = customer.whatsappNumber || customer.phone;
    const phone = TwilioService.formatPhone(phoneNumber);

    if (!phone) {
      console.log('⚠️ Customer has no phone number');
      return;
    }

    const message = MESSAGES.ORDER_CONFIRMED(order, customer);
    const result = await TwilioService.sendMessage(phone, message);
    
    console.log(`✅ Order confirmation sent for ${order.orderId}`);
    return result;

  } catch (error) {
    console.error('❌ Error sending order confirmation:', error.message);
  }
};

// 💰 2. Send Payment Received (when payment is added)
export const sendPaymentReceived = async (orderId, payment) => {
  try {
    console.log(`📨 Sending payment confirmation for: ${orderId}`);
    
    const order = await Order.findById(orderId)
      .populate('customer');

    if (!order) {
      console.log('❌ Order not found');
      return;
    }

    const customer = order.customer;
    const phoneNumber = customer.whatsappNumber || customer.phone;
    const phone = TwilioService.formatPhone(phoneNumber);

    if (!phone) {
      console.log('⚠️ Customer has no phone number');
      return;
    }

    const message = MESSAGES.PAYMENT_RECEIVED(order, customer, payment);
    const result = await TwilioService.sendMessage(phone, message);
    
    console.log(`✅ Payment confirmation sent for ${order.orderId}`);
    return result;

  } catch (error) {
    console.error('❌ Error sending payment confirmation:', error.message);
  }
};

// 🚚 3. Send Ready to Deliver (when order status becomes 'ready-to-delivery')
export const sendReadyToDeliver = async (orderId) => {
  try {
    console.log(`📨 Sending ready to deliver for order: ${orderId}`);
    
    const order = await Order.findById(orderId)
      .populate('customer')
      .populate('garments');

    if (!order) {
      console.log('❌ Order not found');
      return;
    }

    // ✅ Only send if status is actually ready-to-delivery
    if (order.status !== 'ready-to-delivery') {
      console.log(`⚠️ Order status is ${order.status}, not sending ready message`);
      return;
    }

    const customer = order.customer;
    const phoneNumber = customer.whatsappNumber || customer.phone;
    const phone = TwilioService.formatPhone(phoneNumber);

    if (!phone) {
      console.log('⚠️ Customer has no phone number');
      return;
    }

    const message = MESSAGES.READY_FOR_DELIVERY(order, customer);
    const result = await TwilioService.sendMessage(phone, message);
    
    console.log(`✅ Ready to deliver sent for ${order.orderId}`);
    return result;

  } catch (error) {
    console.error('❌ Error sending ready to deliver:', error.message);
  }
};