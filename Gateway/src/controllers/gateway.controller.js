const axios = require("axios");

const { USER_PORT, POST_PORT, CHAT_PORT } = require("../config");

const userHost = `http://localhost:${USER_PORT}`;
const postHost = `http://localhost:${POST_PORT}`;
const chatHost = `http://localhost:${CHAT_PORT}`;

//endpoint that get followings from userHost and posts from postHost and return all posts for homepage
const homepage = async (req, res) => {
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
    posts.map((post) => {
      if (post.userId === userId) {
        post.username = userInfo.username;
        post.profilePicture = userInfo.profilePicture;
      }

      return post;
    });
    posts.map((post) => {
      const user = followings.find(
        (following) => following._id === post.userId
      );
      if (user) {
        post.username = user.username;
        post.profilePicture = user.profilePicture;
      }

      return post;
    });

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
};

//endpoint that get all chatList and uniqueUsers from chat ms which is then used to request their info from user ms
const chatList = async (req, res) => {
  try {
    const authHead = req.headers.authorization;
    const token = authHead.split(" ")[1];
    const chatResult = await axios.get(`${chatHost}/api/get-chatList`, {
      headers: { Authorization: "Bearer " + token}
    });
    const uniqueUser = chatResult.data.uniqueUser;
    const chatList = chatResult.data.chatList;
    const userResult = await axios.post(`${userHost}/api/admin/get-multiUser`, {uniqueUser});
    const usersInfo = userResult.data.usersInfo;

    chatList.map((message, index) => {
      const userInfo = usersInfo[index];
      message.fullname = userInfo.fullname;
      message.profilePicture = userInfo.profilePicture;
      message.username = userInfo.username;
    });

    res.status(200).send({
      status: "success",
      chatList
    })
  } catch (err) {
    res.status(500).send({
      status: "failure",
      message: err.message,
    });
  }
}

module.exports = {
    homepage,
    chatList
}
