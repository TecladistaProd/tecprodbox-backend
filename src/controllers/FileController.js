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

  async remove(req, res) {
    const { id } = req.param;
    const { file_id } = req.body;

    const box = await Box.findById(id);
    const file = await File.findById(file_id);
    let fIndex = box.files.findIndex(
      f => JSON.stringify(f._id) == JSON.stringify(file._id)
    );
    if (fIndex > -1) {
      try {
        box.files.splice(1, fIndex);
        await box.save();
        let fName = file.path;
        await file.remove();
        await require("../helpers/removeFile")(fName);
        req.io.to(box._id).emit("remove", file._id);
        return res.json({
          deleted: true,
          files: await require("../helpers/removeFile").readdir()
        });
      } catch (err) {}
    }
    return res.send(fIndex);
  }
}

module.exports = new FileController();
