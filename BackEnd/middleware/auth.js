const jwt = require("jsonwebtoken");
const config = require("../config/keys");

module.exports = (req, res, next) => {
  //Get Token From Header
  const token = req.header("x-auth-token");

  //check if no token
  if (!token) {
    return res.status(401).json({
      msg: "No Token!, Authorization Denied!",
    });
  }

  // Verify Token
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: " Token is Not Valid!" });
  }
};
