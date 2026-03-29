import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const flowSid = process.env.TWILIO_FLOW_SID;

// Initialize client only if credentials exist to prevent startup crashes
let client = null;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

/**
 * 🚀 TRIGGER TWILIO STUDIO FLOW (DYNAMIC)
 * Executes a predefined Studio Flow with custom parameters.
 */
export const triggerEmergencyFlow = async (to, contactName, patientName, symptom, lat, lng) => {
  try {
    if (!client || !flowSid) {
      console.warn("⚠️ Twilio Flow credentials missing. Skipping flow execution.");
      return null;
    }

    const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;
    
    const params = {
      contact_name: contactName,
      contact_phone: to,
      patient_name: patientName,
      symptom: symptom,
      location_link: mapLink
    };

    console.log("📡 TWILIO SOS PAYLOAD:", JSON.stringify(params, null, 2));

    // Trigger the Studio Flow with custom parameters
    // Note: parameters MUST be a JSON string for Studio to parse them into widgets.trigger.parsed
    const execution = await client.studio.v2.flows(flowSid)
      .executions
      .create({
        to: to,
        from: twilioPhone,
        parameters: JSON.stringify(params) 
      });

    console.log(`✅ Twilio Studio Flow triggered for ${to}: ${execution.sid}`);
    return execution.sid;
  } catch (error) {
    console.error(`❌ Twilio Flow Error (${to}):`, error.message);
    return null;
  }
};

/**
 * 📱 SEND ENHANCED EMERGENCY SMS (LEGACY FALLBACK)
 */
export const sendEmergencySMS = async (to, contactName, patientName, symptom, lat, lng) => {
  try {
    if (!client) {
      console.warn("⚠️ Twilio credentials missing. SMS skipped.");
      return null;
    }

    const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;
    const dynamicMessage = `Hello ${contactName}. EMERGENCY: ${patientName} has reported ${symptom}. They are located at ${mapLink}.`;

    const message = await client.messages.create({
      body: dynamicMessage,
      from: twilioPhone,
      to: to
    });

    return message.sid;
  } catch (error) {
    console.error(`❌ Twilio SMS Error (${to}):`, error.message);
    return null;
  }
};

/**
 * 📞 TRIGGER ENHANCED EMERGENCY VOICE CALL (LEGACY FALLBACK)
 */
export const triggerEmergencyCall = async (to, contactName, patientName, symptom, lat, lng) => {
  try {
    if (!client) {
      console.warn("⚠️ Twilio credentials missing. Voice call skipped.");
      return null;
    }

    const twiml = `<Response><Say voice="alice">Emergency Alert. This is the AI Health Portal. Your contact, ${patientName}, is experiencing a crisis related to ${symptom}. We have sent a location link to your mobile phone. Please check it immediately.</Say></Response>`;

    const call = await client.calls.create({
      twiml: twiml,
      from: twilioPhone,
      to: to
    });

    return call.sid;
  } catch (error) {
    console.error(`❌ Twilio Voice Error (${to}):`, error.message);
    return null;
  }
};

/**
 * 🏥 SEND BOOKING CONFIRMATION (UNIVERSAL)
 * Notifies the patient of their confirmed appointment.
 */
export const sendBookingConfirmation = async (to, patientName, specialty, facility, time) => {
  try {
    if (!client) {
      console.warn("⚠️ Twilio credentials missing. Confirmation SMS skipped.");
      return null;
    }

    const messageBody = `Hello ${patientName}, your appointment for ${specialty} at ${facility} is CONFIRMED for ${new Date(time).toLocaleString()}. See you then!`;

    const message = await client.messages.create({
      body: messageBody,
      from: twilioPhone,
      to: to
    });

    console.log(`✅ Confirmation SMS sent to ${to}: ${message.sid}`);
    return message.sid;
  } catch (error) {
    console.error(`❌ Confirmation SMS Error (${to}):`, error.message);
    return null;
  }
};
