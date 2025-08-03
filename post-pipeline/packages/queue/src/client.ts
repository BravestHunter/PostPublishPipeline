import { Kafka } from 'kafkajs';

const { KAFKA_BROKERS = 'kafka:9092', KAFKA_CLIENT_ID = 'content-platform' } = process.env;

export const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: KAFKA_BROKERS.split(',').map((b) => b.trim()),
});
