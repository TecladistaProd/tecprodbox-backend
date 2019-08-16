const { Router } = require("express");
const multer = require("../config/multer");

const route = Router();

const BoxController = require("../controllers/BoxController");
const FileController = require("../controllers/FileController");

route.get("/users", (req, res) => {
  return res.status(200).send({
    message: "Hello World"
  });
});

route.post("/boxes", BoxController.store);
route.get("/boxes/:id", BoxController.show);

route.post("/boxes/:id/files", multer().single("file"), FileController.store);

module.exports = route;
