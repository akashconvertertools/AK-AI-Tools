import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { prompt } = req.body || {};

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        error: "Prompt is required"
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is not configured on Vercel"
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await client.responses.create({
      model: "gpt-5.6",
      input: `Improve the following AI image/video generation prompt. 
Make it detailed, professional, cinematic and clear while preserving the user's original idea.

User prompt:
${prompt.trim()}

Return only the improved prompt.` 
    });

    const improvedPrompt = response.output_text?.trim();

    if (!improvedPrompt) {
      return res.status(500).json({
        error: "No improved prompt was returned"
      });
    }

    return res.status(200).json({
      prompt: improvedPrompt
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error?.message || "Prompt improvement failed"
    });
  }
}
