const express = require("express");
const { getEdr } = require("../controllers/estadoDeResultado");

const edrRouter = express.Router();

edrRouter.get("/", getEdr);

module.exports = edrRouter;
