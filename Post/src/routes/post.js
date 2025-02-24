const express = require("express");

const postController = require("../controllers/post");
const postValidation = require("../validation/post.validation");
const { authVerify } = require("../utils");
const {validateBody, validateParams} = require("../middleware/validator");

const router = express.Router();

//endpoint to upload a post
router.post("/upload-post", authVerify, validateBody(postValidation.postSchema), postController.createPost);

//endpoint to get posts for homepage
router.post("/home", authVerify, validateBody(postValidation.homepageSchema), postController.getHomepage);

//endpoint to get a users posts
router.get("/get-userPosts/:id", validateParams(postValidation.userIdSchema), postController.getUserPosts);

//endpoint to like and unlike a post
router.put("/like/:id", authVerify, validateParams(postValidation.postIdSchema), postController.likePost);

module.exports = router;
