const express = require("express");
const router = express.Router();
const Problem = require("../models/problem");
const Submission = require("../models/submission");
const { verifyAuth, getUser } = require("../middlewares/auth");

router.post("/submit", verifyAuth, async (req, res) => {
  let count = 1;
  const cnt = await Problem.countDocuments();
  if (cnt) count = cnt + 1;

  try {
    let titleSlug = req.body.title.toLowerCase().split(" ").join("-");
    await Problem.create({
      title: req.body.title,
      titleSlug,
      number: count,
      difficulty: req.body.difficulty,
      tags: [{ name: "Array", slug: "array" }],
      description: req.body.description,
      exampleTestCase: req.body.example,
      testCases: req.body.testcases,
      expectedOutput: req.body.output,
    });
    res.status(200).send("submitted");
  } catch (error) {
    res.status(500).send({ status: "error", error: "Duplicate key error" });
  }
});

router.get("/all", getUser, async (req, res) => {
  try {
    let submissions = [];
    if (req.user) {
      submissions = await Submission.aggregate([
        {
          $match: { "submitted_by.username": req.user.username },
        },
        {
          $sort: { timestamp: -1 },
        },
        {
          $group: {
            _id: "$titleSlug",
            stats: { $addToSet: "$status_id" },
          },
        },
      ]);
    }
    const problems = await Problem.find(
      { approved: true },
      { title: 1, titleSlug: 1, difficulty: 1, number: 1, tags: 1 }
    );

    const result =
      submissions.length > 0
        ? problems.map((problem) => {
            const sub = submissions.find((s) => problem.titleSlug === s._id);
            const status = sub
              ? sub.stats.includes(3)
                ? "solved"
                : "attempted"
              : "todo";
            return {
              ...problem._doc,
              status,
            };
          })
        : problems;
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: "error", error: err });
  }
});

router.get("/unapproved", verifyAuth, async (req, res) => {
  if (!req.user.admin) {
    res.status(401).send("Unauthorized access");
    return;
  }
  try {
    const problems = await Problem.find({ approved: false });

    res.status(200).send(problems);
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: "error", error: err });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const problems = await Problem.findOne(
      { titleSlug: slug },
      { approved: 0 }
    );

    res.status(200).send(problems);
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: "error", error: err });
  }
});

router.patch("/approve", verifyAuth, async (req, res) => {
  if (!req.user.admin) {
    res.status(401).send("Unauthorized access");
    return;
  }
  try {
    await Problem.updateOne(
      { _id: req.body._id },
      { $set: { approved: true } }
    );

    res.status(200).send("approved");
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: "error", error: err });
  }
});

module.exports = router;
