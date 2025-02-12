const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        max: 50,
        default: ""
    },
    profilePicture: {
        type: String,
        default: "http://localhost:8001/images/defaultavatar.png"
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    jwtToken: {
        type: String,
    }
});

module.exports = mongoose.model('User', userSchema);