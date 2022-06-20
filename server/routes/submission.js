const express = require("express");
const router = express.Router();
const Submission = require("../models/submission");
const { verifyAuth } = require("../middlewares/auth");

router.post("/", verifyAuth, async (req, res) => {
  let count = 1;
  const cnt = await Submission.countDocuments();
  count = cnt + 1;
  try {
    const data = req.body;
    await Submission.create({
      sub_id: count,
      submitted_by: { username: req.user.username },
      ...data,
    });
    res.status(201).send("Successfully submitted");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", error: "Duplicate email or username" });
  }
});

router.get("/:slug", verifyAuth, async (req, res) => {
  try {
    const slug = req.params.slug;
    const submissions = await Submission.find(
      {
        $and: [
          { titleSlug: slug },
          { "submitted_by.username": req.user.username },
        ],
      },
      { sub_id: 1, time: 1, memory: 1, status: 1, language: 1, timestamp: 1 }
    ).sort({ timestamp: -1 });

    res.status(200).send(submissions);
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: "error", error: err });
  }
});

module.exports = router;
