const Post = require("../models/post");

//function to create and save a new post
const createPost = async (req, res) => {
  try {
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    const user = req.user;
    const post = await Post({
      imageUrl: imageUrl,
      description: description,
      userId: user._id,
    });
    const postSaved = await post.save();
    if (postSaved) {
      res.status(200).send({
        status: "success",
        message: "Post added successfully",
      });
    } else {
      res.status(401).send({
        status: "failure",
        message: "Post couldn't be added.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: err.message,
    });
  }
};

//function to extract all post of self and following users
const getHomepage = async (req, res) => {
  try {
    const followings = req.body.followings;
    const userId = req.body.userId;
    const myPosts = await Post.find({ userId: userId });
    const followingPosts = await Promise.all(
      followings.map((followingId) => {
        return Post.find({ userId: followingId });
      })
    );
    const posts = myPosts.concat(...followingPosts);
    res.status(200).send({
      status: "success",
      posts: posts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: err.message,
    });
  }
};

//function to return the users posts
const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({userId: userId});
    res.status(200).send({
        status: "success",
        posts: posts,
    })
  } catch (err) {
    res.status(500).send({
      status: "failure",
      message: err.message,
    });
  }
};

//function to like and unlike a post
const likePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;
    const post = await Post.findById(postId, {
      likes: true
    });

    if(post.likes.includes(userId)) {
      await post.updateOne({
        $pull: {likes: userId}
      });
    } else {
      await post.updateOne({
        $push: {likes: userId}
      })
    }

    res.status(200).send({
      status: "success",
      message: "Post Like updated"
    })
  } catch (err) {
    res.status(500).send({
      status: "failure",
      message: err.message,
    })
  }
}

module.exports = {
  createPost,
  getHomepage,
  getUserPosts,
  likePost
};
