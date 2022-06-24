const mongoose = require("mongoose");

const Discussion = new mongoose.Schema(
  {
    discussion_id: { type: Number },
    submitted_by: { username: { type: String }, name: { type: String } },
    title: { type: String, required: true },
    topic: { type: String, default: "general" },
    description: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "discussions" }
);

const model = mongoose.model("Discussion", Discussion);

module.exports = model;
