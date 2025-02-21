const dotenv = require("dotenv");

const configFile = "./src/.env";
dotenv.config({ path: configFile });

module.exports = {
  PORT: process.env.PORT,
  USER_PORT: process.env.USER_PORT,
  POST_PORT: process.env.POST_PORT,
  CHAT_PORT: process.env.CHAT_PORT,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD
};
