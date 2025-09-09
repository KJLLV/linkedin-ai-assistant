import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app = express();
app.use(bodyParser.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
