const path = require("path");
const express = require("express");
const cors = require("cors");
const {Redis} = require("ioredis");
const { redisClient } = require("./redis");

const { PORT } = require("./config");
const { dbConnection } = require("./database");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

const StartServer = async () => {
  const app = express();
  app.use(cors());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //connecting to database
  await dbConnection();

  console.log(await redisClient.ping());

  app.get("/temp", (req, res) => {
    redisClient.publish("user-notify", JSON.stringify({"val": "value of val"}));
    res.status(200).json({message: "success"});
  })

  // const redisClient = redis.createClient({
  //   password: "T7XA56RQmetRTTxmi4tJXR1R8z1hqiv8",
  //   socket: {
  //     host: "redis-13398.c90.us-east-1-3.ec2.redns.redis-cloud.com",
  //     port: 13398,
  //   },
  // });

  // redisClient.on("error", (err) => {
  //   console.log("Redis client error", err);
  // });

  // redisClient.on("ready", () => {
  //   console.log("Redis client is ready");
  // });

  // await redisClient.connect();
  // console.log(await redisClient.ping());

  // redisClient.on("connect", () => {
  //   console.log("connected to redis successfully!");
  // });

  //setting static images folder for saving profile picture
  app.use("/images", express.static(path.join(__dirname, "images")));

  //starting endpoint for the auth router
  app.use("/api/auth", authRouter);
  //starting endpoint for the user router
  app.use("/api/admin", userRouter);

  //connecting to the port
  app.listen(PORT, () => {
    console.log(`Server connected to Port ${PORT}`);
  });
};

StartServer();
