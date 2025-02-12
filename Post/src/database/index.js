const mongoose = require("mongoose");

const { DB_URL } = require("../config");

//function to connect to 'Post' database
const dbConnection = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("DataBase Connected");
  } catch (err) {
    console.log("Error on Database");
    console.log(err);
  }
};

module.exports = { dbConnection };
