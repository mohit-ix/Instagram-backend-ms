const dotenv = require("dotenv");

const configFile = "./src/.env";
dotenv.config({ path: configFile });

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  SECRET_KEY: process.env.SECRET_KEY,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
};
