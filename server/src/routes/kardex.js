const express = require("express");

const kardexRouter = express.Router();

const checkJwt = require("../middlewares/session");
const {
  entradas,
  obtenerSaldo,
  salidas,
  kardexPeps,
} = require("../controllers/kardex");

kardexRouter.post("/entradas/:id_ingredient", checkJwt, entradas);
kardexRouter.post("/obtenerSaldo/:id_ingredient", obtenerSaldo);
kardexRouter.post("/salidas/:id_ingredient", checkJwt, salidas);
kardexRouter.post("/peps", checkJwt, kardexPeps);

module.exports = kardexRouter;
