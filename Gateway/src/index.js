const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");
const axios = require("axios");

const { PORT, USER_PORT, POST_PORT } = require("./config");

const app = express();

app.use(cors());

const userHost = `http://localhost:${USER_PORT}`;
const postHost = `http://localhost:${POST_PORT}`;

//endpoint that get followings from userHost and posts from postHost and return all posts for homepage
app.get("/get-home", async (req, res) => {
  try {
    const authHead = req.headers.authorization;
    const token = authHead.split(" ")[1];
    const userResult = await axios.get(`${userHost}/api/admin/get-following`, {
      headers: { Authorization: "Bearer " + token },
    });
    const followings = userResult.data.followings;
    const userInfo = userResult.data.userInfo;
    const userId = userInfo.userId;
    const postResult = await axios.post(
      `${postHost}/api/home`,
      {
        userId,
        followings,
      },
      {
        headers: { Authorization: "Bearer " + token },
      }
    );
    const posts = postResult.data.posts;
    posts.map(((post) => {
      if(post.userId === userId) {
        post.username = userInfo.username;
        post.profilePicture = userInfo.profilePicture;
      }
      
      return post;
    }));
    posts.map(((post) => {
      const user = followings.find(following => following._id === post.userId);
      if(user) {
        post.username = user.username;
        post.profilePicture = user.profilePicture;
      }
      
      return post;
    }));

    res.status(200).send({
      status: "success",
      posts: posts,
    });
  } catch (err) {
    res.status(500).send({
      status: "failure",
      message: err.message,
    });
  }
});

app.use("/user", proxy(userHost));
app.use("/post", proxy(postHost));

app.listen(PORT, () => {
  console.log(`Server connected to Port ${PORT}`);
});
