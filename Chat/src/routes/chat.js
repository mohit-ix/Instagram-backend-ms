const express = require("express");
const chatController = require("../controller/chat");
const { authVerify } = require("../utils");

const router = express.Router();

//endpoint to get all messages
router.get("/get-chat/:id", authVerify, chatController.getMessages);

//endpoint to receive recent messages
router.get("/get-chatList", authVerify, chatController.getChatList);

module.exports = router;
