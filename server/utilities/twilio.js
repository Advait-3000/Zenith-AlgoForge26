import dotenv from "dotenv";
dotenv.config();

import twilio from "twilio";
console.log(0)
const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

export const sendOTPSMS = async (phone, otp) => {
  await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: process.env.TWILIO_PHONE,
    to: phone,
  });
};