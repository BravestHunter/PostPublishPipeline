import { kafka } from './client.js';
import { TOPICS } from './topics.js';

const producer = kafka.producer();

export const connectProducer = () => producer.connect();

export const publishPostCreated = (postId: string) =>
  producer.send({
    topic: TOPICS.POST_CREATED,
    messages: [{ key: postId, value: JSON.stringify({ postId }) }],
  });

export const publishPostApproved = (postId: string) =>
  producer.send({
    topic: TOPICS.POST_APPROVED,
    messages: [{ key: postId, value: JSON.stringify({ postId }) }],
  });
