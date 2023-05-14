const express = require("express");
const router = express.Router();
const fs = require("fs");

const pathRoute = `${__dirname}`;

const removeExt = (fileName) => {
  return fileName.split(".").shift();
};

fs.readdirSync(pathRoute).filter((file) => {
  const fileWithOutExt = removeExt(file);
  const skip = ["index"].includes(fileWithOutExt);
  if (!skip) {
    router.use(`/${fileWithOutExt}`, require(`./${fileWithOutExt}`));
    console.log(`Route /${fileWithOutExt} loaded`);
  }
});

module.exports = router;
