const mongoose = require("mongoose");
// fields: 'stdout,time,memory,stderr,token,compile_output,message,status,status_id,language'
const Submission = new mongoose.Schema(
  {
    sub_id: { type: Number },
    submitted_by: { username: { type: String } },
    code: { type: String, required: true },
    stdout: { type: String },
    time: { type: String, required: true },
    memory: { type: Number, required: true },
    stderr: { type: String },
    token: { type: String, required: true, unique: true },
    compile_output: { type: String },
    message: { type: String },
    status: { id: { type: Number }, description: { type: String } },
    status_id: { type: Number },
    language: { id: { type: Number }, name: { type: String } },
    title: { type: String, required: true },
    titleSlug: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "submissions" }
);

const model = mongoose.model("Submissions", Submission);

module.exports = model;
