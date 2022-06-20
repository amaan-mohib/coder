const mongoose = require("mongoose");

const Problem = new mongoose.Schema(
  {
    title: { type: String, required: true },
    titleSlug: { type: String, required: true, unique: true },
    number: { type: Number },
    difficulty: { type: Number, required: true },
    tags: [
      {
        name: { type: String },
        slug: { type: String, required: true },
      },
    ],
    description: { type: String, required: true },
    exampleTestCase: { type: String },
    testCases: { type: String },
    expectedOutput: { type: String, required: true },
    approved: { type: Boolean, default: false },
  },
  { collection: "problems" }
);

const model = mongoose.model("Problems", Problem);

module.exports = model;
