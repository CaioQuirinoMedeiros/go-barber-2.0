interface IRedisConfig {
  driver: 'redis';
  redisURL: string;
}

export default {
  driver: 'redis',
  redisURL: process.env.REDIS_URL,
} as IRedisConfig;
