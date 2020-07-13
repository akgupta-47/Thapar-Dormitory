const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/userModel");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require('dotenv');

dotenv.config(); 

router.get("/login", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id).select("-password");
    res.send(user);
  } catch (e) {
    res.status(500).send("Server Error");
  }
});

//@access Public
//@route Post api/auth
//@desc Login user
router.post(
  "/login",
  [
    check("email", "Enter a valid email address").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send("Invalid Credentials");
      }
      const payload = { user: { id: user.id } };
      jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '18000s' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (e) {
      res.status(500).send("Server Error");
    }
  }
);

//@route Post api/users
//@desc Register user
//@access Public
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Enter a valid email address").isEmail(),
    check("password", "Minimum length of the password must be 6").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      user = new User({ name, email, password });
      let salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = { user: { id: user.id } };
      jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '18000s' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (e) {
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
