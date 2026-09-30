import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, size = "1024x1024" } = req.body || {};

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is not configured on Vercel"
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const result = await client.images.generate({
      model: "gpt-image-2",
      prompt: prompt.trim(),
      size
    });

    const image = result?.data?.[0];

    if (!image) {
      return res.status(500).json({
        error: "No image was returned by the AI provider"
      });
    }

    if (image.b64_json) {
      return res.status(200).json({
        image: `data:image/png;base64,${image.b64_json}`
      });
    }

    if (image.url) {
      return res.status(200).json({
        image: image.url
      });
    }

    return res.status(500).json({
      error: "Image response did not contain an image"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error?.message || "Image generation failed"
    });
  }
}
