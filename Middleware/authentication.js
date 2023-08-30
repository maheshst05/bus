const jwt = require("jsonwebtoken");
const  BlacklistedToken = require("../Model/blacklistedModel");
require('dotenv').config();

const authentication = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;
if (!accessToken) {
      return res.status(401).json({ msg: "Please log in to continue." });
    }

    const blacklistedToken = await BlacklistedToken.findOne({ token: accessToken });
    if (blacklistedToken) {
      return res.status(401).json({ msg: "You are logged out. Please log in again." });
    }

    jwt.verify(accessToken, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        return res.status(401).json({ msg: "Your session has expired, please login" });
      }
      next();
    });
  } catch (error) {
    res.status(500).json({ msg: "An error occurred.", error: error.message });
  }
};

module.exports = authentication;
