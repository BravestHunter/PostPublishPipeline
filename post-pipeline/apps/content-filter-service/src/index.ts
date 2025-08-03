import '@repo/config';
import { connectToDatabase, PostRepository } from '@repo/db';
import { getObjectDownloadUrl } from '@repo/file-storage';
import { connectProducer, publishPostApproved, runConsumer, TOPICS } from '@repo/queue';
import { GeminiModerationService } from './services/geminiModerationService.js';

await connectToDatabase();

const moderationService = new GeminiModerationService(process.env.GEMINI_API_KEY ?? '');

await runConsumer('content-filter-service', TOPICS.POST_CREATED, async (value) => {
  try {
    const { postId } = JSON.parse(value.toString()) as { postId: string };
    if (!postId) {
      console.warn('[content-filter-service] postId is missing in message:', value.toString());
      return;
    }

    const post = await PostRepository.getPostById(postId);
    if (!post) {
      console.warn(`[content-filter-service] post not found: ${postId}`);
      return;
    }

    const mediaFiles =
      post.mediaFiles && post.mediaFiles.length
        ? await Promise.all(
            post.mediaFiles.map(async (f) => ({
              url: await getObjectDownloadUrl(f.path), // S3 key → URL
              filename: f.filename,
              mimetype: f.mimetype,
              size: f.size,
            })),
          )
        : undefined;
    console.log(`[content-filter-service] post ${postId} found, media files:`, mediaFiles);

    const verdict = await moderationService.checkPost({
      text: post.text,
      socialPlatform: post.socialPlatform,
      mediaFiles,
    });

    await PostRepository.updatePostStatus(
      postId,
      verdict.isApproved ? 'approved' : 'rejected',
      verdict.reason,
    );

    if (verdict.isApproved) {
      console.log(`[content-filter-service] post ${postId} approved, publishing to queue`);
      await connectProducer();
      await publishPostApproved(post._id.toString());
    }

    console.log(
      `[content-filter-service] post ${postId} → ${verdict.isApproved ? 'approved' : 'rejected'} (${verdict.reason})`,
    );
  } catch (err) {
    console.error('[content-filter-service] Error processing message:', err);
  }
});

console.log('[content-filter-service] worker running & listening to Kafka');
