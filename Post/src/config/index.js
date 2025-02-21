const dotenv = require("dotenv");

const configFile = "./src/.env";
dotenv.config({ path: configFile });

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  SECRET_KEY: process.env.SECRET_KEY
};
