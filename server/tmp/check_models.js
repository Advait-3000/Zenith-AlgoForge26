import https from "https";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = "";
  res.on("data", (chunk) => data += chunk);
  res.on("end", () => {
    try {
      const json = JSON.parse(data);
      if (json.models) {
        json.models.forEach(m => console.log(m.name.split("/").pop()));
      } else {
        console.log("No models found or error:", data);
      }
    } catch (e) {
      console.log("Parse error:", data);
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
