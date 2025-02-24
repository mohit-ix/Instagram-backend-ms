const express = require("express");

const {validateBody} = require("../middleware/validator");
const authController = require("../controllers/auth");
const authValidation = require("../validation/auth.validation");

const router = express.Router();

//endpoint to signup a user
router.post("/signup", validateBody(authValidation.signupSchema), authController.userSignup);

//endpoint to login a user
router.post("/login", validateBody(authValidation.loginSchema), authController.userLogin);

//endpoint to logout a user
router.get("/logout", authController.userLogout);

module.exports = router;