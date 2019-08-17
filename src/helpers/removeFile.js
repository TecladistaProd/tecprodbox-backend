const unlink = require("util").promisify(require("fs").unlink);
const readdir = require("util").promisify(require("fs").readdir);

const path = require("path");

exports.removeFile = async file => {
  return await unlink(path.resolve(__dirname, "..", "..", "tmp", file));
};

exports.readdir = async () => {
  return await readdir(path.resolve(__dirname, "..", "..", "tmp"));
};
