const { hash, compare } = require("bcryptjs");

const encrypt = async (pass) => {
  const hashPassword = await hash(pass, 8);
  return hashPassword;
};

const verified = async (pass, hashPass) => {
  const verified = await compare(pass, hashPass);
  return verified;
};

module.exports = {
  encrypt,
  verified,
};
