require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);
const users = require("./routes/user");
const problems = require("./routes/problem");
const submissions = require("./routes/submission");
const progress = require("./routes/progress");
const userinfo = require("./routes/userinfo");

app.use("/user", users);
app.use("/problems", problems);
app.use("/submissions", submissions);
app.use("/progress", progress);
app.use("/userinfo", userinfo);
app.get("/", (req, res) => {
  res.send("Server is up and running");
});
app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
