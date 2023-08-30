const mongoose = require("mongoose");

const BlacklistedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // expires: 3600,  Tokens expire after a certain time (in seconds)
  },
});

const BlacklistedToken = mongoose.model("BlacklistedToken", BlacklistedTokenSchema);

module.exports = BlacklistedToken;
