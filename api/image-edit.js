import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is not configured on Vercel"
      });
    }

    const { prompt, image } = req.body || {};

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        error: "Edit prompt is required"
      });
    }

    if (!image) {
      return res.status(400).json({
        error: "Reference image is required"
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const result = await client.images.edit({
      model: "gpt-image-2",
      image: image,
      prompt: prompt.trim()
    });

    const output = result?.data?.[0];

    if (!output) {
      return res.status(500).json({
        error: "No edited image was returned"
      });
    }

    if (output.b64_json) {
      return res.status(200).json({
        image: `data:image/png;base64,${output.b64_json}`
      });
    }

    if (output.url) {
      return res.status(200).json({
        image: output.url
      });
    }

    return res.status(500).json({
      error: "Edited image response did not contain an image"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error?.message || "Image editing failed"
    });
  }
}
