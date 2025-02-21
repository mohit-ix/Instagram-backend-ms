const axios = require("axios");

const { redisPub, redisSub } = require("../redisClient");

const { USER_PORT } = require("../config");

const userHost = `http://localhost:${USER_PORT}`;

module.exports = (socket, io, onlineUsers) => {
  redisSub.subscribe("add-message-resp");

  socket.on("add-message", (data) => {
    console.log("in add-message");
    redisPub.publish("add-message", JSON.stringify(data));
  });

  redisSub.on("message", async (channel, message) => {
    console.log("in response");
    if (channel === "add-message-resp") {
      const data = JSON.parse(message);
      console.log(data);
      const userInfo = await axios.get(`${userHost}/api/admin/get-user/${data.toUserId}`);
      const username = userInfo.data.user.username;
      console.log(onlineUsers);
      console.log(onlineUsers[username]);
      io.emit("add-message-response", data);
    }
  });
};
