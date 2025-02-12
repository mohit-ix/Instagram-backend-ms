const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

//endpoint to signup a user
router.post("/signup", authController.userSignup);

//endpoint to login a user
router.post("/login", authController.userLogin);

//endpoint to logout a user
router.get("/logout", authController.userLogout);

module.exports = router;