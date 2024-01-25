const express = require("express");
const checkJwt = require("../middlewares/session");
const {
  pruebaFecha,
  edr,
  getEdrByDate,
  getEdrData,
  getPieChartEdr,
} = require("../controllers/estadoDeResultado");

const edrRouter = express.Router();

edrRouter.get("/test", pruebaFecha);
edrRouter.post("/create", checkJwt, edr);
edrRouter.post("/get", checkJwt, getEdrByDate);
edrRouter.post("/get-data", checkJwt, getEdrData);
edrRouter.post("/get-pie-chart", checkJwt, getPieChartEdr);

module.exports = edrRouter;
