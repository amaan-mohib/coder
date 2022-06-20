const express = require("express");
const router = express.Router();
const Problem = require("../models/problem");
const { verifyAuth } = require("../middlewares/auth");

router.post("/submit", verifyAuth, async (req, res) => {
  let count = 1;
  const cnt = await Problem.countDocuments();
  count = cnt + 1;

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

router.get("/all", async (req, res) => {
  try {
    const problems = await Problem.find(
      { approved: true },
      { title: 1, titleSlug: 1, difficulty: 1, number: 1, tags: 1 }
    );

    res.status(200).send(problems);
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
