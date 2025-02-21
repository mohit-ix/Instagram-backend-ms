const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");
const axios = require("axios");
const { createServer } = require("http");
const { Server } = require("socket.io");
const initiateSocket = require("./socket");
const { redisPub, redisSub } = require("./redisClient");
const gatewayRouter = require("./routes/gateway.routes");

const { PORT, USER_PORT, POST_PORT, CHAT_PORT } = require("./config");

async function serverStart() {
  const app = express();

  app.use(cors());

  const userHost = `http://localhost:${USER_PORT}`;
  const postHost = `http://localhost:${POST_PORT}`;
  const chatHost = `http://localhost:${CHAT_PORT}`;

  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  // object that will contain online users socket id
  let onlineUsers = {};

  io.on("connection", (socket) => {
    console.log("Connected", socket.id);

    //on user login or on refresh save the socketId.
    socket.on("login", (user) => {
      onlineUsers[user] = socket.id;
      console.log(onlineUsers);
    });

    //on receiving the message the data is published to chat microservice
    socket.on("add-message", (data) => {
      console.log("in add-message");
      redisPub.publish("add-message", JSON.stringify(data));
    });

    //on disconnection delete the socketId.
    socket.on("disconnect", (reason) => {
      const username = Object.keys(onlineUsers).find((user) => {
        return onlineUsers[user] === socket.id;
      });
      delete onlineUsers[username];
      console.log("Disconnected", reason);
    });
  });

  // initiateSocket(server);

  //subscribing to followUser/unfollowUser for realtime change and add-message-resp for realtime chatlist change
  redisSub.subscribe("followUser", "unfollowUser", "add-message-resp");
  redisSub.on("message", async (channel, message) => {
    //when user is followed
    if (channel === "followUser") {
      io.to(onlineUsers[message]).emit("followInc", message);
    }
    //when user is unfollowed
    if (channel === "unfollowUser") {
      io.to(onlineUsers[message]).emit("followDesc", message);
    }
    //when the messaged is saved in database
    if (channel === "add-message-resp") {
      const data = JSON.parse(message);
      //getting info of user to which the data is sent
      const toUserInfo = await axios.get(
        `${userHost}/api/admin/get-user/${data.toUserId}`
      );
      //getting info of user from which the data is being sent
      const fromUserInfo = await axios.get(
        `${userHost}/api/admin/get-user/${data.fromUserId}`
      )
      const toUser = toUserInfo.data.user;
      const fromUser = fromUserInfo.data.user;
      //sending the message to the target user
      io.to(onlineUsers[toUser.username]).emit("add-message-response", data);
      data.fullname = fromUser.fullname;
      data.profilePicture = fromUser.profilePicture;
      //sending the message back to current user for updating chatlist
      io.to(onlineUsers[toUser.username]).emit("add-chatList", data);
      data.fullname = toUser.fullname;
      data.profilePicture = toUser.profilePicture;
      //sending the message to target user for updating chatList
      io.to(onlineUsers[fromUser.username]).emit("add-userChatList", data);
    }
  });

  app.use("/user", proxy(userHost));
  app.use("/post", proxy(postHost));
  app.use("/chat", proxy(chatHost));
  app.use("/", gatewayRouter);

  server.listen(PORT, () => {
    console.log(`Server connected to Port ${PORT}`);
  });
}

serverStart();
