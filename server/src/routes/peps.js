const express = require("express");
const {
  ingresarSaldoInicial,
  metodoPeps,
  deleteSaldo,
  ingresarEntrada,
  obtenerEntradas,
  obtenerSalidas,
  obtenerSaldo,
} = require("../controllers/peps");

const router = express.Router();

router.post("/saldo/:id_ingredient", ingresarSaldoInicial);
router.post("/entrada/:id_ingredient", ingresarEntrada);
router.post("/calcular/:id_ingredient", metodoPeps);
router.get("/entradas-data/:id_ingredient", obtenerEntradas);
router.get("/salidas-data/:id_ingredient", obtenerSalidas);
router.get("/saldo-data/:id_ingredient", obtenerSaldo);
router.delete("/deleteSaldo", deleteSaldo);

module.exports = router;
