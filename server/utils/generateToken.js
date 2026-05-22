const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  // payload: { id, avatar }
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = generateToken;
