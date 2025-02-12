const dotenv = require("dotenv");

const configFile = "./src/.env";
dotenv.config({ path: configFile });

module.exports = {
  PORT: process.env.PORT,
  USER_PORT: process.env.USER_PORT,
  POST_PORT: process.env.POST_PORT,
};
