const File = require("../models/File");
const exists = require("util").promisify(require("fs").exists);

module.exports = async () => {
  try {
    const files = await File.find({});
    for (let file of files) {
      if (
        !(await exists(
          require("path").resolve(__dirname, "..", "..", file.path)
        ))
      ) {
        const Box = require("../models/Box");
        const box = await Box.findOne({ files: file._id }).exec();

        let fIndex = box.files.findIndex(
          f => JSON.stringify(f._id) == JSON.stringify(file._id)
        );

        if (fIndex > -1) {
          box.files.splice(fIndex, 1);
          await box.save();
        }
        await file.remove();
      }
    }
  } catch (err) {}
};
