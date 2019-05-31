import Redis from 'ioredis';
let redis;
export default function redisClient() {
  redis = new Redis(6379, 'redis');
  return redis;
}
