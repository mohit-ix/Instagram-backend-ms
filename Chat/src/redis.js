const { Redis } = require("ioredis");

const {REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = require("./config");

const redisPub = Redis.createClient({
  password: REDIS_PASSWORD,
  host: REDIS_HOST,
  port: REDIS_PORT,
});

const redisSub = Redis.createClient({
  password: REDIS_PASSWORD,
  host: REDIS_HOST,
  port: REDIS_PORT,
});

redisPub.on("error", (err) => {
  console.log("Redis client error", err);
});

redisPub.on("ready", () => {
  console.log("Redis client is ready");
});

redisPub.on("connect", () => {
  console.log("connected to redis successfully!");
});

redisSub.on("error", (err) => {
  console.log("Redis client error", err);
});

redisSub.on("ready", () => {
  console.log("Redis client is ready");
});

redisSub.on("connect", () => {
  console.log("connected to redis successfully!");
});

module.exports = {
  redisPub,
  redisSub
};
