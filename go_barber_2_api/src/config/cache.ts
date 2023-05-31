import { RedisOptions } from 'ioredis';

interface IRedisConfig {
  driver: 'redis';

  config: RedisOptions;
}

export default {
  driver: 'redis',

  config: process.env.REDIS_URL
    ? process.env.REDIS_URL
    : {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASS || undefined,
      },
} as IRedisConfig;
