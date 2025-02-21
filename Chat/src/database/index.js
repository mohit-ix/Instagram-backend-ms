const mongoose = require("mongoose");
const { DB_URL } = require("../config");

const dbConnect = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Chat Database connected");
  } catch (err) {
    console.log("Chat Database not connected");
    console.log(err);
  }
};

module.exports = { dbConnect };
