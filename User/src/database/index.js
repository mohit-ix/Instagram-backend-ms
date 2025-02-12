const mongoose = require("mongoose");

const {DB_URL} = require("../config");

//function to connect to user database
const dbConnection = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log("User Database Connected");
    } catch(err) {
        console.log("Error in User Database");
        console.log(err);
    }
}

module.exports = {
    dbConnection,
}