const express = require("express");

const postController = require("../controllers/post");
const { authVerify } = require("../utils");

const router = express.Router();

//endpoint to upload a post
router.post("/upload-post", authVerify, postController.createPost);

//endpoint to get posts for homepage
router.post("/home", authVerify, postController.getHomepage);

//endpoint to get a users posts
router.get("/get-userPosts/:id", postController.getUserPosts);

//endpoint to like and unlike a post
router.put("/like/:id", authVerify, postController.likePost);

module.exports = router;
