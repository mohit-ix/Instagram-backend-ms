const Message = require("../model/message");
const { redisPub, redisSub } = require("../redis");

module.exports = () => {
  //subscribing to channel for receiving messages
  redisSub.subscribe("add-message", (err, count) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("in chat", count);
    }
  });

  //receive message and publish it when message is saved
  redisSub.on("message", async (channel, message) => {
    if (channel === "add-message") {
      const data = JSON.parse(message);
      const chatMessage = await Message({
        toUserId: data.toUserId,
        fromUserId: data.fromUserId,
        message: data.message,
      });
      const messageSaved = await chatMessage.save();
      redisPub.publish("add-message-resp", JSON.stringify(data));
    }
  });
};
