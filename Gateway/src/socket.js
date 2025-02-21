const { Server } = require("socket.io");
const followHandler = require("./redisHandlers/followHandlers");
const chatHandler = require("./redisHandlers/chatHandlers");

let io;
let onlineUsers = {};

const initiateSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  

  io.on("connection", (socket) => {
    console.log("Connected", socket.id);

    //on user login or on refresh save the socketId.
    socket.on("login", (user) => {
      onlineUsers[user] = socket.id;
      console.log(onlineUsers);
      followHandler(socket, io, onlineUsers);
      chatHandler(socket, io, onlineUsers);
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
};


module.exports = initiateSocket