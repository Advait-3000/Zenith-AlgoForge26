import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const flowSid = process.env.TWILIO_FLOW_SID;

console.log("🔍 Checking Twilio Credentials...");
console.log(`SID: ${accountSid}`);
console.log(`Token: ${authToken ? "Loaded (Hidden)" : "MISSING"}`);
console.log(`Flow SID: ${flowSid}`);

if (!accountSid || !authToken) {
  console.error("❌ ERROR: Missing SID or Token in .env");
  process.exit(1);
}

const client = twilio(accountSid, authToken);

async function testConnection() {
  try {
    const account = await client.api.v2010.accounts(accountSid).fetch();
    console.log(`✅ SUCCESS: Connected to Twilio Account: ${account.friendlyName}`);
    
    if (flowSid) {
        try {
            const flow = await client.studio.v2.flows(flowSid).fetch();
            console.log(`✅ SUCCESS: Studio Flow found: ${flow.friendlyName}`);
        } catch (e) {
            console.error(`❌ ERROR: Could not find Studio Flow ${flowSid}:`, e.message);
        }
    }
    
    console.log("\n🚀 Your credentials are VALID.");
  } catch (error) {
    console.error("\n❌ AUTHENTICATION FAILED.");
    console.error("Reason:", error.message);
    console.error("\nTIP: Ensure you copied the AUTH TOKEN for the NEW account (ending in bc3).");
    process.exit(1);
  }
}

testConnection();
