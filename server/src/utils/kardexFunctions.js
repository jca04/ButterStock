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

module.exports = { agregarSaldosRestantes };
