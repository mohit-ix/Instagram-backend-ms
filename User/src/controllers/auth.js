const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../model/user");
const { SECRET_KEY } = require("../config");

const { generateAccessToken } = require("../utils/generateToken");

//function to create and save a new user
const userSignup = async (req, res) => {
  try {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const fullname = req.body.fullname;
    if (
      (await User.findOne({ email: email })) ||
      (await User.findOne({ username: username }))
    ) {
      res.status(401).send({
        status: "failure",
        message: "Email or username already exists",
      });
    } else {
      const hashedpassword = await bcrypt.hash(password, 12);

      const user = new User({
        email,
        username,
        fullname,
        password: hashedpassword,
      });
      const savedUser = await user.save();

      if (savedUser) {
        res.status(200).send({
          status: "success",
          message: "User created",
        });
      } else {
        res.status(401).send({
          status: "failure",
          message: "User couldn't be created.",
        });
      }
    }
  } catch (err) {
    res.status(500).send({
      status: "failure",
      mesasge: err.mesasge,
    });
  }
};

//function to add jwtToken and log the user in
const userLogin = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({ username: username });
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const accessToken = generateAccessToken(user);
        User.findByIdAndUpdate(user._id, {
          jwtToken: accessToken,
        });
        const { jwtToken, password, ...other } = user._doc;
        res.status(200).send({
          status: "success",
          message: "User Logged In",
          data: other,
          accessToken,
        });
      } else {
        res.status(401).send({
          status: "failure",
          message: "Password does not match",
        });
      }
    } else {
      res.status(401).send({
        status: "failure",
        message: "user not found"
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "failure",
      message: err.message,
    });
  }
};

//function to remove jwtToken and log user out
const userLogout = async (req, res) => {
  try{
    await User.findOneAndUpdate({jwtToken: req.body.accessToken}, [
      {$unset: ['jwtToken']}
    ]);
    res.status(200).send({
      status: "success",
      message: "Logout Successful"
    })
  } catch (err) {
    res.status(500).send({
      status: "failure",
      message: err.message,
    });
  }
}

//middleware to verify the jwt token
const verify = async (req, res, next) => {
  try {
    const authHead = req.headers.authorization;
    if (!authHead) {
      res.status(403).json("You are not authorized");
    }
    const token = authHead.split(" ")[1];
    if(token != "null"){
      jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
          console.log(err);
          throw new Error("token is invalid");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(403).send({
        status: "failure",
        message: "token not found",
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "failure",
      message: err.message,
    });
  }
};

module.exports = {
  userSignup,
  userLogin,
  userLogout,
  verify,
};
