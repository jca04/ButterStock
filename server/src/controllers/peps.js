const conn = require("../db/db");
const pepsQueries = require("../db/sql/pepsQueries");

const ingresarSaldoInicial = async (req, res) => {
  try {
    const { id_ingredient } = req.params;
    const { cantidad, costo } = req.body;
    const saldoQuery = pepsQueries.insertSaldo;
    const saldo_inicial = await conn.query(saldoQuery, [
      cantidad,
      costo,
      cantidad * costo,
      1,
      id_ingredient,
    ]);
    if (saldo_inicial.affectedRows === 1) {
      res.status(200).json({ message: "saldo inicial ingresado" });
    }
  } catch (error) {
    res.status(500).json({ message: "error al ingresar saldo inicial", error });
  }
};

const ingresarEntrada = async (req, res) => {
  try {
    const { id_ingredient } = req.params;
    const { cantidad, costo } = req.body;
    const entradaQuery = pepsQueries.insertEntrada;
    const saldoQuery = pepsQueries.insertSaldo;
    const entrada = await conn.query(entradaQuery, [
      cantidad,
      costo,
      cantidad * costo,
      id_ingredient,
    ]);
    if (entrada.affectedRows === 1) {
      await conn.query(saldoQuery, [
        cantidad,
        costo,
        cantidad * costo,
        1,
        id_ingredient,
      ]);
      res.status(200).json({ message: "entrada ingresada" });
    }
  } catch (error) {
    res.status(500).json({ message: "error al ingresar entrada", error });
  }
};

const metodoPeps = async (req, res) => {
  try {
    const { id_ingredient } = req.params;
    const { cantidad } = req.body;

    if (!id_ingredient || !cantidad) {
      return res.status(400).json({ message: "no se ingresaron datos" });
    }

    const obtenerSaldos = pepsQueries.getSaldos;
    const saldos = await conn.query(obtenerSaldos, [id_ingredient]);

    // traigo el primer saldo que entro y el saldo siguiente
    const primerSaldo = saldos[0];
    const segundoSaldo = saldos[1];

    if (!primerSaldo || !segundoSaldo) {
      return res
        .status(404)
        .json({ message: "no hay saldo suficiente para el cálculo" });
    }

    // obtengo los valores de los saldos
    const {
      cantidad: cantidadInicial,
      costo: costoInicial,
      id_saldo: idSaldoInicial,
    } = primerSaldo;
    const {
      cantidad: cantidadSiguiente,
      costo: costoSiguiente,
      id_saldo: idSaldoSiguiente,
    } = segundoSaldo;

    // Querys
    const insertSalida = pepsQueries.insertSalida;
    const insertSaldo = pepsQueries.insertSaldo;
    const updateSaldo = pepsQueries.updateSaldo;

    // cuando la cantidad de salida es mayor a la cantidad del primer saldo
    if (cantidad > cantidadInicial) {
      await conn.query(insertSalida, [
        cantidadInicial,
        costoInicial,
        cantidadInicial * costoInicial,
        id_ingredient,
      ]);
      await conn.query(updateSaldo, [idSaldoInicial, id_ingredient]);

      // resto la cantidad de salida con la cantidad del primer saldo para saber cuanto me queda por sacar, despues le resto a la cantidad del segundo saldo para saber cuanto me queda de saldo
      const restante = cantidad - cantidadInicial;
      const cantidadActual = cantidadSiguiente - restante;
      const totalActual = cantidadActual * costoSiguiente;

      // aqui ya se calcula lo que va a ser la salida
      const cantidadSalida = cantidadSiguiente - cantidadActual;
      const totalSalida = cantidadSalida * costoSiguiente;

      // inserto la salida, el saldo y actualizo el saldo anterior para que no se tome en cuenta
      await conn.query(insertSalida, [
        cantidadSalida,
        costoSiguiente,
        totalSalida,
        id_ingredient,
      ]);
      await conn.query(insertSaldo, [
        cantidadActual,
        costoSiguiente,
        totalActual,
        1,
        id_ingredient,
      ]);
      await conn.query(updateSaldo, [idSaldoSiguiente, id_ingredient]);
    }

    // cuando el saldo inicial es mayor a la cantidad de salida
    else if (cantidadInicial > cantidad) {
      const cantidadActual = cantidadInicial - cantidad;
      const totalActual = cantidadActual * costoInicial;

      // la salida
      const totalSalida = cantidad * costoInicial;

      // pongo en cero el saldo inicial y el saldo siguiente
      await conn.query(updateSaldo, [idSaldoInicial, id_ingredient]);
      await conn.query(updateSaldo, [idSaldoSiguiente, id_ingredient]);

      // inserto la salida y el nuevo saldo y vuela a poner el saldo siguiente
      await conn.query(insertSalida, [
        cantidad,
        costoInicial,
        totalSalida,
        id_ingredient,
      ]);
      await conn.query(insertSaldo, [
        cantidadActual,
        costoInicial,
        totalActual,
        1,
        id_ingredient,
      ]);
      await conn.query(insertSaldo, [
        cantidadSiguiente,
        costoSiguiente,
        cantidadSiguiente * costoSiguiente,
        1,
        id_ingredient,
      ]);
    }

    res.status(200).json({ message: "salida ingresada" });
  } catch (error) {
    res.status(500).json({ message: "error al calcular", error });
  }
};

const obtenerEntradas = async (req, res) => {
  try {
    const { id_ingredient } = req.params;
    const entradaQuery = pepsQueries.getEntradas;
    const entradas = await conn.query(entradaQuery, [id_ingredient]);
    res.status(200).json({ entradas });
  } catch (error) {
    res.status(500).json({ message: "error al obtener entradas", error });
  }
};

const obtenerSalidas = async (req, res) => {
  try {
    const { id_ingredient } = req.params;
    const salidaQuery = pepsQueries.getSalidas;
    const salidas = await conn.query(salidaQuery, [id_ingredient]);
    res.status(200).json({ salidas });
  } catch (error) {
    res.status(500).json({ message: "error al obtener salidas", error });
  }
};

const obtenerSaldo = async (req, res) => {
  try {
    const { id_ingredient } = req.params;
    const saldoQuery = pepsQueries.getSaldo;
    const saldo = await conn.query(saldoQuery, [id_ingredient]);
    res.status(200).json({ saldo });
  } catch (error) {
    res.status(500).json({ message: "error al obtener saldo", error });
  }
};

const deleteSaldo = async (req, res) => {
  try {
    await conn.query("TRUNCATE TABLE tbl_saldo");
    await conn.query("TRUNCATE TABLE tbl_entrada");
    await conn.query("TRUNCATE TABLE tbl_salida");
    res.status(200).json({ message: "datos eliminado" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = {
  ingresarSaldoInicial,
  metodoPeps,
  deleteSaldo,
  ingresarEntrada,
  obtenerEntradas,
  obtenerSalidas,
  obtenerSaldo,
};
