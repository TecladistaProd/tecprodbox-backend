const { Schema, model } = require("mongoose");

const File = new Schema(
  {
    title: { type: String, required: true },
    path: { type: String, required: true }
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

File.virtual("url").get(function() {
  return `${process.env.URL ||
    "http://localhost:9000"}/files/${encodeURIComponent(this.path)}`;
});

module.exports = model("File", File);
