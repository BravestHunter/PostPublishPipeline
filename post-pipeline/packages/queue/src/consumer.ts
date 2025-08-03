import { kafka } from './client.js';

export const runConsumer = async (
  groupId: string,
  topic: string,
  onMsg: (value: Buffer, key: Buffer | null) => Promise<void>,
) => {
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  console.log('Connected to Kafka');
  await consumer.subscribe({ topic, fromBeginning: false });
  console.log(`Subscribed to ${topic}`);

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        await onMsg(message.value!, message.key);
      } catch (err) {
        console.error(err);
      }
    },
  });
};
