const File = require("../models/File");
const Box = require("../models/Box");

class FileController {
  async store(req, res) {
    const { id } = req.params;
    const box = await Box.findById(id);

    const { originalname: title, key: path } = req.file;

    const file = await File.create({
      title,
      path
    });

    box.files.push(file);

    await box.save();

    req.io.to(box._id).emit("file", file);

    return res.send(file);
  }
}

module.exports = new FileController();
