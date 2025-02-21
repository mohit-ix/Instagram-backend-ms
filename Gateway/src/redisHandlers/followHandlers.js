const { redisSub } = require("../redisClient");

module.exports = (socket, io) => {
  redisSub.subscribe("followUser", "unfollowUser");
  redisSub.on("message", (channel, message) => {
    console.log("in follow");
    if (channel === "followUser") {
      io.to(onlineUsers[message]).emit("followInc", message);
    }
    if (channel === "unfollowUser") {
      io.to(onlineUsers[message]).emit("followDesc", message);
    }
  });
};
