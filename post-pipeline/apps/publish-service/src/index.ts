import '@repo/config';
import { connectToDatabase, PostRepository } from '@repo/db';
import { runConsumer, TOPICS } from '@repo/queue';

await connectToDatabase();

await runConsumer('publish-service', TOPICS.POST_APPROVED, async (value) => {
  try {
    const { postId } = JSON.parse(value.toString()) as { postId: string };
    if (!postId) {
      console.warn('[publish-service] postId is missing in message:', value.toString());
      return;
    }

    const post = await PostRepository.getPostById(postId);
    if (!post) {
      console.warn(`[publish-service] post not found: ${postId}`);
      return;
    }

    console.log(`[publish-service] posting ${postId} to social platform: ${post.socialPlatform}`);

    // TODO: Implement the logic to post to the social platform
  } catch (err) {
    console.error('[publish-service] Error processing message:', err);
  }
});

console.log('[publish-service] worker running & listening to Kafka');
