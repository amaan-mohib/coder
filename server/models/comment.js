const mongoose = require("mongoose");

const Comment = new mongoose.Schema(
  {
    discussion_id: { type: Number },
    submitted_by: { username: { type: String }, name: { type: String } },
    description: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "comments" }
);

const model = mongoose.model("Comment", Comment);

module.exports = model;
