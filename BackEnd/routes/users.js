const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/keys");
const normalize = require("normalize-url");
const { check, validationResult } = require("express-validator");

// User Model
const User = require("../models/Users");
router.get("/register", (req, res) => {
  res.send("registerPage");
});
//Register user api
router.post(
  "/register",
  [
    check("name", "Please Enter name !").not().isEmpty(),
    check("email", "Please Enter valid E-Mai !").isEmail(),
    check(
      "password",
      "Please Enter a password with 6 or more characters !"
    ).isLength({
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
      // if user Exists
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({
          errors: [{ msg: "user Already exists" }],
        });
      }
      //get user Gravatar
      const avatar = normalize(
        gravatar.url(email, {
          s: "200",
          r: "pg",
          d: "mm",
        }),
        { forceHttps: true }
      );
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //encrypt Password

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      //Return json Web Token
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.jwtSecret,
        {
          expiresIn: 36000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error!");
    }
  }
);

//Login user api
router.post(
  "/login",
  [
    check("email", "Please include valid E-Mai!").isEmail(),
    check("password", "Password is required!").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      // if user does not Exists
      let user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({
          errors: [{ msg: "Invalid Credentials" }],
        });
      }
      //Match user password and encrypted password.
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.status(400).json({
          errors: [{ msg: "Invalid Credentials" }],
        });
      }
      //Return json Web Token
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.jwtSecret,
        {
          expiresIn: 3600000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error!");
    }
  }
);

module.exports = router;
