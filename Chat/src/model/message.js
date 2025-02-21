const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    toUserId: {
      type: String,
      required: true,
    },
    fromUserId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);