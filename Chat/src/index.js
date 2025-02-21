const express = require("express");
const cors = require("cors");

const {dbConnect} = require("./database");
const chatRedis = require("./controller/chatRedis");
const chatRouter = require("./routes/chat");

const { PORT } = require("./config");

const startServer = async () => {
    const app = express();

    app.use(cors());

    await dbConnect();

    chatRedis();

    app.use("/api", chatRouter);

    app.listen(PORT, () => {
        console.log(`Server connected to port ${PORT}`);
    })
}

startServer();