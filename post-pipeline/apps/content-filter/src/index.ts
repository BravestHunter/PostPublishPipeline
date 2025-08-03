import express from 'express';
import 'dotenv/config';
import multer from 'multer';
import Post from './post.js';
import { GeminiModerationService } from './services/geminiModerationService.js';

const moderationService = new GeminiModerationService(process.env.GEMINI_API_KEY ?? '');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 5, fileSize: 8 * 1024 * 1024 }, // max 5 × 8 MB
});

const app = express();
app.use(express.json());

app.get('/healthz', (_req, res) => res.send('OK'));

app.post(
  '/moderatePost',
  upload.fields([
    { name: 'mediaFiles', maxCount: 5 },
    { name: 'post', maxCount: 1 },
  ]),
  async (req, res) => {
    const postField = (req.body.post ?? req.body)?.toString?.();
    if (!postField) {
      return res.status(400).json({ error: 'post field missing' });
    }

    const post: Post = JSON.parse(postField);
    post.mediaFiles = req.files?.mediaFiles as Express.Multer.File[] | undefined;

    if (!post.text || !post.socialPlatform) {
      return res.status(400).json({ error: 'text and socialPlatform required' });
    }

    const verdict = await moderationService.checkPost(post);
    return res.json(verdict);
  },
);

const port = Number(process.env.PORT) || 40001;
app.listen(port, () => console.log(`[content-filter] listening on :${port}`));
