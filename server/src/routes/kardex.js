const express = require("express");

const kardexRouter = express.Router();

const checkJwt = require("../middlewares/session");
const {
  entradas,
  obtenerSaldo,
  salidas,
  kardexPeps,
  entradasPromPonderado,
  salidasPromPonderado,
} = require("../controllers/kardex");
const { validateInventory } = require("../controllers/validacionInventario");

kardexRouter.post("/entradas/:id_ingredient", checkJwt, entradas);
kardexRouter.post("/obtenerSaldo/:id_ingredient", obtenerSaldo);
kardexRouter.post("/salidas/:id_ingredient", checkJwt, salidas);
kardexRouter.post("/", checkJwt, kardexPeps);
kardexRouter.post(
  "/promedio/entradas/:id_ingredient",
  checkJwt,
  entradasPromPonderado
);
kardexRouter.post(
  "/promedio/salidas/:id_ingredient",
  checkJwt,
  salidasPromPonderado
);
kardexRouter.post("/validacion/:id_ingredient", checkJwt, validateInventory);

module.exports = kardexRouter;
