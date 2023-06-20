const { sign, verify } = require("jsonwebtoken");
const config = require("../config");

const generateToken = (id) => {
  const jwt = sign({ id }, config.JWT_SECRET, { expiresIn: 86400 });
  return jwt;
};

const verifyToken = (token) => {
  const verified = verify(token, config.JWT_SECRET);
  return verified;
};

module.exports = {
  generateToken,
  verifyToken,
};
