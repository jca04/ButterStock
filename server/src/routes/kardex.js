const express = require("express");

const kardexRouter = express.Router();

const checkJwt = require("../middlewares/session");
const {
  entradas,
  obtenerSaldo,
  salidas,
  kardexPeps,
} = require("../controllers/kardex");

kardexRouter.post("/entradas/:id_ingredient", entradas);
kardexRouter.post("/obtenerSaldo/:id_ingredient", obtenerSaldo);
kardexRouter.post("/salidas/:id_ingredient", salidas);
kardexRouter.post("/peps/:id_ingredient", kardexPeps);

module.exports = kardexRouter;
