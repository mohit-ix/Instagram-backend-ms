const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
    imageUrl: {
        type: String,
        required: true
    },
    description: {
        type: String,
        max: 50,
        default: "",
    },
    likes: {
        type: Array,
        default: [],
    },
    userId: {
        type: String,
        required: true,
    },
    
},
{timestamps: true});

module.exports = mongoose.model("Post", postSchema);