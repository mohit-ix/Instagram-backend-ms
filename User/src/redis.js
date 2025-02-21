const { Redis } = require("ioredis");

const {REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = require("./config");

const redisClient = Redis.createClient({
  password: REDIS_PASSWORD,
  host: REDIS_HOST,
  port: REDIS_PORT,
});

redisClient.on("error", (err) => {
  console.log("Redis client error", err);
});

redisClient.on("ready", () => {
  console.log("Redis client is ready");
});

redisClient.on("connect", () => {
  console.log("connected to redis successfully!");
});

module.exports = {
    redisClient
}

