import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import OpenAI from "openai";
dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_APIKEY });

const app = express();
const corsOptions = {
  origin: ["http://localhost:8080", "http://localhost:5173"],
  method: ["GET", "POST"],
};
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ messages: "hi" });
});

app.post("/generate", async (req, res) => {
  const body = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `Write a catchy youtube introduction based on the following script: \n ${body.message}`,
        },
      ],
    });
    res.status(200).send(completion);
    return;
  } catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.listen(process.env.SERVER_PORT || 8080, () => {
  console.log("SERVER STARTED ON PORT: ", process.env.SERVER_PORT || 8080);
});
