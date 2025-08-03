import '@repo/config';
import { connectToDatabase, PostRepository } from '@repo/db';
import { upload } from '@repo/file-storage';
import { connectProducer, publishPostCreated } from '@repo/queue';
import express from 'express';
import { z } from 'zod';

await connectToDatabase();
await connectProducer();

const app = express();

const formFieldsSchema = z.object({
  text: z.string().min(1),
  socialPlatform: z.string().min(1),
});

app.get('/healthz', (_req, res) => res.send('OK'));

app.post('/posts', upload.array('mediaFiles', 5), async (req, res) => {
  try {
    const { text, socialPlatform } = formFieldsSchema.parse(req.body);

    const mediaFiles = (req.files as (Express.Multer.File & { key: string })[] | undefined)?.map(
      (f) => ({
        filename: f.originalname,
        mimetype: f.mimetype,
        size: f.size,
        path: f.key,
      }),
    );

    const post = await PostRepository.createPost({
      text,
      socialPlatform,
      mediaFiles,
      status: 'pending',
    });

    await publishPostCreated(post._id.toString());

    res.status(201).json({ id: post._id.toString() });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.issues });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/posts/:id', async (req, res) => {
  try {
    const post = await PostRepository.getPostById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    res.json({
      id: post._id,
      text: post.text,
      socialPlatform: post.socialPlatform,
      status: post.status,
      reason: post.reason,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = process.env.PORT ?? 4000;
app.listen(port, () => console.log(`[post-api-service] listening on :${port}`));
