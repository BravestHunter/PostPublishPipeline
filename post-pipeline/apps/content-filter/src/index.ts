import express from "express";
import 'dotenv/config';
import { GeminiModerationService } from "./services/geminiModerationService.js";
import Post from "./post.js";

const moderationService = new GeminiModerationService(
  process.env.GEMINI_API_KEY ?? ""
);

const app = express();
app.use(express.json());

app.get("/healthz", (_req, res) => res.send("OK"));

app.post("/moderatePost", async (req: Request<{}, any, Post>, res) => {
  const post = req.body;
  if (!post) {
    return res.status(400).json({ error: "invalid request" });
  }

  const verdict = await moderationService.checkText(post);
  return res.json(verdict);
});

const port = Number(process.env.PORT) || 8080;
app.listen(port, () => console.log(`[content-filter] listening on :${port}`));
