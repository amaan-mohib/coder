const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { verifyAuth } = require("../middlewares/auth");

router.get("/me", verifyAuth, (req, res) => {
  res.send(req.user);
});

router.post("/register", async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    await User.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });
    res.status(200).send("Registration successful");
  } catch (error) {
    console.error(error);
    res.status(401).send("Duplicate email or password");
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({
    $or: [
      {
        email: req.body.email,
      },
      { username: req.body.email },
    ],
  });
  if (!user) {
    return res.status(401).send("Make sure you are registered");
  }
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (isPasswordValid) {
    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
        name: user.name,
        admin: user.admin,
      },
      process.env.JWT_SECRET
    );
    res.status(200).json({ accessToken: token });
  } else {
    res.status(401).send("Wrong email or password");
  }
});

module.exports = router;
