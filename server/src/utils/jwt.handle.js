const { sign, verify } = require("jsonwebtoken");
const config = require("../config");

const generateToken = (id) => {
  const jwt = sign({ id }, config.JWT_SECRET, { expiresIn: "1d" });
  return jwt;
};

const verifyToken = (token) => {
  const verified = verify(token, config.JWT_SECRET);
  return verified;
};

const decodeToken = (token) => {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
  } catch (err) {
    return { message: err };
  }
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
};
