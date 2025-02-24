const express = require("express");
const chatController = require("../controller/chat");
const chatValidation = require("../validation/chat.validation");
const {validateParams} = require("../middleware/validator");
const { authVerify } = require("../utils");

const router = express.Router();

//endpoint to get all messages
router.get("/get-chat/:id", authVerify, validateParams(chatValidation.userIdSchema), chatController.getMessages);

//endpoint to receive recent messages
router.get("/get-chatList", authVerify, chatController.getChatList);

module.exports = router;
