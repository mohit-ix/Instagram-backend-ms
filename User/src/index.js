const path = require("path");
const express = require("express");
const cors = require("cors");

const { PORT } = require("./config");
const {dbConnection} = require("./database");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

const StartServer = async () => {
    const app = express();
    app.use(cors());

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    //connecting to database
    await dbConnection();

    //setting static images folder for saving profile picture
    app.use("/images", express.static(path.join(__dirname, "images")));

    //starting endpoint for the auth router
    app.use("/api/auth", authRouter);
    //starting endpoint for the user router
    app.use("/api/admin", userRouter);

    //connecting to the port
    app.listen(PORT, () => {
        console.log(`Server connected to Port ${PORT}`);
    });
}

StartServer();