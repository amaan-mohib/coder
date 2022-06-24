const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");
const { verifyAuth } = require("../middlewares/auth");

router.post("/post", verifyAuth, async (req, res) => {
  try {
    await Comment.create({
      discussion_id: req.body.discussion_id,
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
    const comments = await Comment.find({ discussion_id: id });
    res.status(200).send(comments);
  } catch (error) {
    // console.error(error);
    res.status(500).send({ status: "error", error: error });
  }
});

module.exports = router;
