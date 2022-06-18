const mongoose = require("mongoose");

const Problem = new mongoose.Schema({
    title: { type: String, required: true },
    titleSlug: { type: String, required: true, unique: true },
    difficulty: { type: String, required: true },
    tags: [{
        name: { type: String },
        slug: { type: String, required: true }
    }],
    description: { type: String, required: true },
}, { collection: "problems" });

const model = mongoose.model("Problems", Problem)

module.exports = model;