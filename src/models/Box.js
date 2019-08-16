const { Schema, model } = require("mongoose");
const {
  Types: { ObjectId }
} = Schema;

const Box = new Schema(
  {
    title: { type: String, required: true },
    files: [{ type: ObjectId, ref: "File" }]
  },
  {
    timestamps: true
  }
);

module.exports = model("Box", Box);
