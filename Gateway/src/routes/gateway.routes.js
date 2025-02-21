const express = require("express");

const gatewayController = require("../controllers/gateway.controller");

const router = express.Router();

//endpoint to get the posts of the homepage
router.get("/get-home", gatewayController.homepage);

//endpoint to get the chatlist of the user
router.get("/getChatList", gatewayController.chatList);

module.exports = router;