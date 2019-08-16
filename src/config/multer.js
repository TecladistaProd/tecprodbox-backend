const multer = require("multer");
const path = require("path");
const randomBytes = require("util").promisify(require("crypto").randomBytes);

const dest = path.resolve(__dirname, "..", "..", "tmp");

const config = {
  dest,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, dest);
    },
    filename: async (req, file, cb) => {
      try {
        let hash = await randomBytes(16);
        hash = hash.toString("hex");

        file.key = `${hash}-${file.originalname}`;
        cb(null, file.key);
      } catch (err) {
        cb(err);
      }
    }
  })
};

// exports.config = config;

// exports.configuredMulter = multer(config);

module.exports = () => multer(config);
