const User = require("../model/user");
const {redisClient} = require("../redis");

//function to get all the followings of a user
const getFollowing = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const followings = await Promise.all(
      user.following.map((followingId) => {
        return User.findById(followingId, {
          username: true,
          profilePicture: true,
        });
      })
    );
    userInfo = {
      userId: userId,
      username: user.username,
      profilePicture: user.profilePicture,
    };
    res.status(200).send({
      status: "success",
      followings,
      userInfo,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: err.message,
    });
  }
};

//function to follow a user
const followUser = async (req, res) => {
  try {
    const followId = req.params.id;
    const userId = req.user._id;
    const user = await User.findById(userId, {
      following: true
    });
    const userToFollow = await User.findById(followId, {
      followers: true,
      username: true,
    });
    if(!user.following.includes(followId)) {
      await user.updateOne({
        $push: {following: followId}
      });
      await userToFollow.updateOne({
        $push: {followers: userId}
      });
      
      redisClient.publish("followUser", userToFollow.username);
      res.status(200).send({
        status:"success",
        message: "followed successfully"
      });
    } else {
      res.status(400).send({
        status: "failure",
        message: "already followed"
      })
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: err.message,
    });
  }
}

//function to unfollow a user
const unfollowUser = async (req, res) => {
  try {
    const followId = req.params.id;
    const userId = req.user._id;
    const user = await User.findById(userId, {
      following: true
    });
    const userToUnfollow = await User.findById(followId, {
      followers: true,
      username: true
    });
    if(user.following.includes(followId)) {
      await user.updateOne({
        $pull: {following: followId}
      });
      await userToUnfollow.updateOne({
        $pull: {followers: userId}
      });

      redisClient.publish("unfollowUser", userToUnfollow.username);
      res.status(200).send({
        status:"success",
        message: "unfollowed successfully"
      });
    } else {
      res.status(400).send({
        status: "failure",
        message: "already not followed"
      })
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: err.message,
    });
  }
}

//function to get info of a user
const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    res.status(200).send({
      status: "success",
      user: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: err.message,
    });
  }
};

//function to get info of multiple users
const getMultiUser = async (req, res) => {
  try {
    const uniqueUser = req.body.uniqueUser;
    const usersInfo = await Promise.all(
      uniqueUser.map((userId) => {
        return User.findById(userId, {
          username: true,
          profilePicture: true,
          fullname: true
        });
      })
    );

    res.status(200).send({
      status: "success",
      usersInfo
    })
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failure",
      message: err.message,
    });
  }
}

//function to get info of a user from token
const getUserFromToken = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    res.status(200).send({
      status: "success",
      user: user,
    });
  } catch (err) {
    res.status(500).send({
      status: "failure",
      message: err.message,
    });
  }
};

//function to search for the query in the database
const searchUsers = async (req, res) => {
  try {
    const search = req.params.username;
    const users = await User.find(
      { username: { $regex: search, $options: "i" } },
      {
        _id: true,
        username: true,
        fullname: true,
        profilePicture: true,
      },
      { limit: 5 }
    );
    res.status(200).send({
      status: "success",
      users: users,
    });
  } catch (err) {
    res.status(500).send({
      status: "failure",
      message: err.message,
    });
  }
};

module.exports = {
  getFollowing,
  followUser,
  unfollowUser,
  getUser,
  getMultiUser,
  getUserFromToken,
  searchUsers,
};
