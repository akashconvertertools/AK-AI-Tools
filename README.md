# AK AI Tools — Vercel Ready

## Deploy
1. Upload this folder to a GitHub repository.
2. Import the repository in Vercel.
3. In Vercel → Project Settings → Environment Variables, add `OPENAI_API_KEY` for Production.
4. Redeploy.
5. Open the generated `.vercel.app` URL on mobile or PC.

## Important
- The OpenAI API key stays server-side in Vercel environment variables.
- Image generation is wired to `/api/generate-image`.
- Prompt improvement is wired to `/api/improve-prompt`.
- Video and reference-image editing are intentionally not faked; those endpoints return a clear message until a provider is connected.
