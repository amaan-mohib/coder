const mongoose = require("mongoose");

const Submission = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false }
}, { collection: "submissions" });

const model = mongoose.model("Submissions", Submission)

module.exports = model;