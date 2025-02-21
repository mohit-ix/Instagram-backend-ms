const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../config");

//middleware to authenticate all the incoming requestes by verifying jwt token
const authVerify = async (req, res, next) => {
    try {
        const authHead = req.headers.authorization;
        const token = authHead.split(" ")[1];
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if(err) {
                throw new Error("Token is invalid");
            }
            req.user = user;
            next();
        })
    } catch(err) {
        res.status(500).send({
            status: "failure",
            message: err.message
        })
    }
}

module.exports = {
    authVerify
}