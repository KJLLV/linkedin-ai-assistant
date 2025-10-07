import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 5050;

if (!process.env.CHROME_EXT_ID) {
  console.error("❌ CHROME_EXT_ID not found in .env. CORS will fail!");
  process.exit(1); // stop server to avoid undefined behavior
}

const allowedOrigins = [
  `chrome-extension://${process.env.CHROME_EXT_ID}`  // your extension ID
];
 // Allow requests from all origins (for development)
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests like curl/postman
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));


// Middleware (optional)
app.use(express.json());



const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


// Test POST route
app.post("/generate", async (req, res) => {
  const { jobTitle, company, description } = req.body;

  const prompt = `
  Job Title: ${jobTitle}
  Company: ${company}
  Job Description: ${description}

  Generate:
  1. A tailored resume (short version).
  2. A professional cover letter.
  `;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  res.json({
    resume: response.choices[0].message.content.split("Cover Letter:")[0],
    coverLetter: response.choices[0].message.content.split("Cover Letter:")[1]
  });
});


// Test GET route
app.get("/", (req, res) => {
  console.log("Received GET / request");
  res.send("<h1>✅ Hello World! Backend is running.</h1>");
});

// Listen on IPv4
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://127.0.0.1:${PORT} (IPv4)`);
});

// Listen on IPv6
app.listen(PORT, "::", () => {
  console.log(`Server running on http://[::1]:${PORT} (IPv6)`);
});
