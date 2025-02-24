const express = require("express");

const userController = require("../controllers/user");
const authController = require("../controllers/auth");
const { validateBody, validateParams } = require("../middleware/validator");
const userValidation = require("../validation/user.validation");

const router = express.Router();

//endpoint to get all followings
router.get(
  "/get-following",
  authController.verify,
  userController.getFollowing
);

//endpoint to follow
router.put(
  "/follow/:id",
  authController.verify,
  validateParams(userValidation.singleIdSchema),
  userController.followUser
);

//endpoint to unfollow
router.put(
  "/unfollow/:id",
  authController.verify,
  validateParams(userValidation.singleIdSchema),
  userController.unfollowUser
);

//endpoint to get a desired user
router.get(
  "/get-user/:id",
  validateParams(userValidation.singleIdSchema),
  userController.getUser
);

//endpoint to get info of multiple users
router.post(
  "/get-multiUser",
  validateBody(userValidation.multiIdSchema),
  userController.getMultiUser
);

//endpoint to get user info from token
router.get("/get-user", authController.verify, userController.getUserFromToken);

//endpoint for searching a for user
router.get(
  "/search-users/:username",
  validateParams(userValidation.usernameSchema),
  userController.searchUsers
);

module.exports = router;
