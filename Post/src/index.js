const path = require("path");

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");

const { PORT } = require("./config");
const { dbConnection } = require("./database");

const postRouter = require("./routes/post");

//function that holds main code and responsible for starting server
const StartServer = async () => {
  const app = express(); //create an express instance
  app.use(cors()); //adding cors to connect all api requests

  // connecting to database
  await dbConnection();

  app.use(express.json()); //express.json enables the use of json files
  //bodyparser enables the use of images
  app.use(bodyParser.urlencoded({ extended: true })); 

  //defining the storage location and file name for images to be stored
  const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "src/images");
    },
    filename: (req, file, cb) => {
      cb(
        null,
        new Date().toISOString().replaceAll(":", "").replace(".", "") +
          "-" +
          file.originalname
      );
    },
  });

  const upload = multer({ storage: fileStorage });

  //endpoint to uploading images for posts
  app.post("/upload", upload.single("file"), (req, res) => {
    try {
      if (req.file) {
        const imageUrl = `http://localhost:${PORT}/images/${req.file.filename}`;
        res.status(200).send({
          status: "Successful",
          imageUrl: imageUrl,
        });
      } else {
        res.status(401).send({
          status: "Failure",
          message: "Image not Found",
        });
      }
    } catch (err) {
      res.status(500).send({
        status: "Failure",
        messasge: err.message,
      });
    }
  });

  //creating a static folder for reading images
  app.use("/images", express.static(path.join(__dirname, "images")));

  //starting endpoint for all post router
  app.use("/api", postRouter);

  //starts the server
  app.listen(PORT, () => {
    console.log(`Server Connected to Port ${PORT}`);
  });
};

StartServer();
