import 'dotenv/config';
import { connectToDatabase, PostRepository } from '@repo/db';
import { runConsumer, TOPICS } from '@repo/queue';

await connectToDatabase();

await runConsumer('social-post-service', TOPICS.POST_APPROVED, async (value) => {
  const { postId } = JSON.parse(value.toString()) as { postId: string };
  if (!postId) {
    console.warn('[social-post-service] postId is missing in message:', value.toString());
    return;
  }

  const post = await PostRepository.getPostById(postId);
  if (!post) {
    console.warn(`[social-post-service] post not found: ${postId}`);
    return;
  }

  console.log(`[social-post-service] posting ${postId} to social platform: ${post.socialPlatform}`);

  // TODO: Implement the logic to post to the social platform
});

console.log('[social-post-service] worker running & listening to Kafka');
