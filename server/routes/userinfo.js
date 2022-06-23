const express = require("express");
const router = express.Router();
const Submission = require("../models/submission");
const Problem = require("../models/problem");
const { verifyAuth } = require("../middlewares/auth");

router.get("/solved", verifyAuth, async (req, res) => {
  try {
    const submissions = await Submission.aggregate([
      {
        $match: {
          $and: [
            { "submitted_by.username": req.user.username },
            { status_id: 3 },
          ],
        },
      },
      {
        $group: {
          _id: "$titleSlug",
        },
      },
    ]);
    const ids = submissions.map((sub) => sub._id);
    const problems = await Problem.aggregate([
      { $match: { titleSlug: { $in: ids } } },
      {
        $group: {
          _id: "$difficulty",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: 1 },
      },
    ]);
    const easy = problems[0]?.count || 0;
    const medium = problems[1]?.count || 0;
    const hard = problems[2]?.count || 0;

    const total = await Problem.countDocuments();

    res.status(200).send({
      all: submissions.length,
      total,
      easy,
      medium,
      hard,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.get("/recentaccept", verifyAuth, async (req, res) => {
  try {
    const submissions = await Submission.aggregate([
      {
        $match: {
          $and: [
            { "submitted_by.username": req.user.username },
            { status_id: 3 },
          ],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $limit: 15,
      },
      {
        $group: {
          _id: "$titleSlug",
          last_solved: { $first: "$timestamp" },
          title: { $first: "$title" },
          sub_id: { $first: "$sub_id" },
        },
      },
    ]);
    res.status(200).send(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;
