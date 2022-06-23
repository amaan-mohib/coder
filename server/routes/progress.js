const express = require("express");
const router = express.Router();
const Problem = require("../models/problem");
const Submission = require("../models/submission");
const { verifyAuth } = require("../middlewares/auth");

router.get("/", verifyAuth, async (req, res) => {
  try {
    const submissions = await Submission.aggregate([
      {
        $match: { "submitted_by.username": req.user.username },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: "$titleSlug",
          stats: { $push: "$status_id" },
          last_solved: { $first: "$timestamp" },
        },
      },
    ]);
    const titles = submissions.map((sub) => sub._id);
    const problems = await Problem.find(
      { titleSlug: { $in: titles } },
      { title: 1, titleSlug: 1, difficulty: 1, number: 1, tags: 1 }
    );
    const list = submissions.map((sub) => {
      const accepted = sub.stats.reduce(
        (pv, cv) => (cv === 3 ? pv + 1 : pv),
        0
      );
      const rejected = sub.stats.length - accepted;
      return {
        ...sub,
        ...problems.find((p) => p.titleSlug === sub._id)._doc,
        accepted,
        rejected,
      };
    });

    res.status(200).send(list);
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: "error", error: err });
  }
});

module.exports = router;
