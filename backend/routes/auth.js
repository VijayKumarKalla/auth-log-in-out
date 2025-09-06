const express = require("express");
const bcrypt = require("bcryptjs");
const { findUserByEmail, createUser } = require("../models/userModel");

const router = express.Router();

router.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ msg: "All fields required" });

  findUserByEmail(email, async (err, user) => {
    if (user) return res.status(400).json({ msg: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    createUser(email, hashedPassword, (err) => {
      if (err) return res.status(500).json({ msg: "Error registering" });
      res.json({ msg: "Registered successfully" });
    });
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ msg: "All fields required" });

  findUserByEmail(email, async (err, user) => {
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    req.session.user = { id: user.id, email: user.email };
    res.json({ msg: "Login successful", user: req.session.user });
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.json({ msg: "Logged out" });
});

router.get("/me", (req, res) => {
  if (req.session.user) return res.json({ user: req.session.user });
  res.status(401).json({ msg: "Not authenticated" });
});

module.exports = router;
