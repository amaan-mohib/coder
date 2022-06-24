const express = require("express");
const router = express.Router();
const Discussion = require("../models/discussion");
const { verifyAuth } = require("../middlewares/auth");

router.get("/all", async (req, res) => {
  const filter = { topic: "general" };
  if (req.query.topic) {
    filter.topic = req.query.topic;
  }
  try {
    const discussions = await Discussion.find(filter).sort({ timestamp: -1 });
    res.status(200).send(discussions);
  } catch (error) {
    // console.error(error);
    res.status(500).send({ status: "error", error: error });
  }
});

router.post("/post", verifyAuth, async (req, res) => {
  let count = 1;
  const cnt = await Discussion.countDocuments();
  if (cnt) count = cnt + 1;

  try {
    // let topic = "general";
    // if (req.body.topic) {
    //   topic = req.body.topic.toLowerCase().split(" ").join("-");
    // }
    await Discussion.create({
      discussion_id: count,
      title: req.body.title,
      topic: req.body.topic,
      description: req.body.description,
      submitted_by: { username: req.user.username, name: req.user.name },
    });
    res.status(200).send("submitted");
  } catch (error) {
    res.status(500).send({ status: "error", error: "Duplicate key error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const discussion = await Discussion.findOne({ discussion_id: id });
    res.status(200).send(discussion);
  } catch (error) {
    // console.error(error);
    res.status(500).send({ status: "error", error: error });
  }
});
module.exports = router;
