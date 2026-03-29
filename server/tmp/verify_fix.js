import axios from 'axios';

const API_URL = 'http://localhost:5000/api/appointments/book';

async function testBooking() {
  console.log("🧪 Starting Booking Test...");
  try {
    const response = await axios.post(API_URL, {
      patient_id: "65f1a2b3c4d5e6f7a8b9c0d1", // Example ID
      reason: "I have severe chest pain and cannot breathe",
      lat: 40.7128,
      lng: -74.0060,
      facility_name: "My Chosen Doctor" // Manually selected doctor
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_TEST_TOKEN' // Need a real token if auth is enabled
      }
    });

    console.log("✅ Response:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("❌ Test Failed:", error.response?.data || error.message);
  }
}

// testBooking();
console.log("To run this test, you need a valid user ID and JWT token.");
