const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

module.exports = function (req, res, next) {
  let token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ msg: "No token, authorisation falied" });
  }
  try {
    let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(401).json({ msg: "Token not valid" });
  }
};