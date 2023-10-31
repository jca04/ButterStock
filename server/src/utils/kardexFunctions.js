const { queryAsync } = require("../utils/queryAsync");
const { v4: uuidv4 } = require("uuid");
/**
 *
 * @param {*} saldosRestantes Array con los saldos restantes
 * @returns {String} Mensaje de exito o error
 */
const agregarSaldosRestantes = async (
  saldosRestantes,
  id_ingredient,
  id_restaurant
) => {
  try {
    const actualizarSaldosRestantes = await Promise.all(
      saldosRestantes.map(async (saldo) => {
        return queryAsync(
          "UPDATE tbl_peps SET saldo_activo = 0 WHERE id_peps = ?",
          [saldo.id_peps]
        );
      })
    );

    const actualziacionExitosa = actualizarSaldosRestantes.every(
      (result) => result.affectedRows > 0
    );

    if (actualziacionExitosa) {
      const insercionSaldosRestantes = await Promise.all(
        saldosRestantes.map(async (saldo) => {
          return queryAsync(
            "INSERT INTO tbl_peps (id_peps, saldo_cantidad, saldo_valorUnitario, saldo_valorTotal, saldo_activo, id_ingrediente, id_restaurante) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
              uuidv4(),
              saldo.saldo_cantidad,
              saldo.saldo_valorUnitario,
              saldo.saldo_valorTotal,
              1,
              id_ingredient,
              id_restaurant,
            ]
          );
        })
      );

      const insercionExitosa = insercionSaldosRestantes.every(
        (result) => result.affectedRows > 0
      );

      if (insercionExitosa) {
        return "Todas las operacionse se realizaron con exito";
      } else {
        return "Error en la insercion de los saldos restantes";
      }
    } else {
      return "Error en la actualizacion de los saldos restantes";
    }
  } catch (error) {
    return error;
  }
};

const procesarSaldos = async (
  saldos,
  cantidadRestante,
  id_ingredient,
  id_restaurant
) => {
  if (cantidadRestante <= 0 || !saldos.length) {
    return cantidadRestante;
  }

  const saldo = saldos[0];
  const cantidadSalida = Math.min(cantidadRestante, saldo.saldo_cantidad);
  const totalSalida = cantidadSalida * saldo.saldo_valorUnitario;

  // Inserta la salida
  const salida = await queryAsync(
    "INSERT INTO tbl_peps (id_peps, salida_cantidad, salida_valorUnitario, salida_valorTotal, id_ingrediente, id_restaurante) VALUES (?, ?, ?, ?, ?, ?)",
    [
      uuidv4(),
      cantidadSalida,
      saldo.saldo_valorUnitario,
      totalSalida,
      id_ingredient,
      id_restaurant,
    ]
  );

  if (salida.affectedRows > 0) {
    const cantidadActual = saldo.saldo_cantidad - cantidadSalida;
    const totalActual = cantidadActual * saldo.saldo_valorUnitario;

    // Actualiza el saldo actual
    await queryAsync(
      "UPDATE tbl_peps SET saldo_cantidad = ?, saldo_valorTotal = ? WHERE id_peps = ?",
      [cantidadActual, totalActual, saldo.id_peps]
    );

    // Actualiza el costo unitario del ingrediente
    await queryAsync(
      "UPDATE tbl_ingredientes SET cost_unitario = ? WHERE id_ingrediente = ?",
      [saldo.saldo_valorUnitario, id_ingredient]
    );

    cantidadRestante -= cantidadSalida;

    // Llama recursivamente a la función para procesar el resto de los saldos
    return procesarSaldos(
      saldos.slice(1),
      cantidadRestante,
      id_ingredient,
      id_restaurant
    );
  }
};

module.exports = { agregarSaldosRestantes, procesarSaldos };
