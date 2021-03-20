const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/Users");

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (user === null) {
      return res.status(400).json({ msg: "user not found" });
    }
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error!" });
  }
});

module.exports = router;
