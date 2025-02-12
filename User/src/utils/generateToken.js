const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../config");

//function to create a jwt token with a secret key for 20 hours
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            username: user.username,
            _id: user._id,
        },
        SECRET_KEY,
        {expiresIn: "20h"}
    );
}

module.exports = {
    generateAccessToken
}