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

router.get("/all", verifyAuth, async (req, res) => {
  try {
    const submissions = await Submission.find(
      { "submitted_by.username": req.user.username },
      {
        sub_id: 1,
        time: 1,
        memory: 1,
        status: 1,
        language: 1,
        timestamp: 1,
        title: 1,
        titleSlug: 1,
        token: 1,
      }
    ).sort({ timestamp: -1 });
    res.status(200).send(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", error: err });
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

router.get("/detail/:sid", async (req, res) => {
  try {
    const sid = req.params.sid;
    const submission = await Submission.findOne(
      { sub_id: sid },
      {
        sub_id: 1,
        time: 1,
        memory: 1,
        status: 1,
        language: 1,
        timestamp: 1,
        token: 1,
        code: 1,
        title: 1,
        titleSlug: 1,
      }
    );

    res.status(200).send(submission);
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: "error", error: err });
  }
});

module.exports = router;
