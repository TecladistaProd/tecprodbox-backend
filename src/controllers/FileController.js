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
    const { id } = req.params;
    const file = await File.findById(id);
    const box = await Box.findOne({ files: id }).exec();
    let fIndex = box.files.findIndex(
      f => JSON.stringify(f._id) == JSON.stringify(file._id)
    );
    if (fIndex > -1) {
      try {
        box.files.splice(fIndex, 1);
        await box.save();

        let fName = file.path;
        await file.remove();
        await require("../helpers/removeFile").removeFile(fName);

        req.io.to(box._id).emit("remove", file._id);
        return res.json({
          deleted: true
        });
      } catch (err) {
        console.log(err);
      }
    }
    return res.send(fIndex);
  }

  async changeName(req, res) {
    const { id } = req.params;
    const file = await File.findById(id);
    const box = await Box.findOne({ files: id }).exec();
    file.title = req.body.new_name;
    await file.save();
    req.io.to(box._id).emit("changed", file);
    return res.json({
      changed: true
    });
  }
}

module.exports = new FileController();
