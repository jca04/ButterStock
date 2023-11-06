const { queryAsync } = require("../utils/queryAsync");
const { convertion } = require("../utils/unitConversion");

const validateInventory = async (req, res) => {
  try {
    const { id_ingredient } = req.params;
    const { id_restaurant, cantidad, unidad_medida, kardex } = req.body.data;

    const unidadMedidaIngrediente = await queryAsync(
      "SELECT nombre_ingrediente, unidad_medida FROM tbl_ingredientes WHERE id_ingrediente = ? && id_restaurant = ?",
      [id_ingredient, id_restaurant]
    );

    const cantidad_convertida = convertion(
      unidad_medida,
      parseFloat(cantidad),
      unidadMedidaIngrediente[0].unidad_medida
    );

    if (kardex.toLowerCase() == "peps") {
      const saldos = await queryAsync(
        "SELECT saldo_cantidad, saldo_valorUnitario, saldo_valorTotal FROM tbl_peps " +
          "WHERE id_ingrediente = ? && id_restaurante = ? && saldo_activo = 1 ORDER BY time_stamp ASC, id_orden ASC",
        [id_ingredient, id_restaurant]
      );

      const saldoTotal = saldos.reduce(
        (acc, saldo) => acc + saldo.saldo_cantidad,
        0
      );

      if (cantidad_convertida > saldoTotal) {
        return res
          .status(200)
          .json({
            message: "No hay suficiente inventario",
            nombre_ingrediente: unidadMedidaIngrediente[0].nombre_ingrediente,
          });
      } else {
        return res.status(200).json({ message: "ok" });
      }
    } else if (kardex.toLowerCase() == "promedio ponderado") {
      const saldos = await queryAsync(
        "SELECT saldo_cantidad, saldo_valorUnitario, saldo_valorTotal FROM tbl_promedio_ponderado " +
          "WHERE id_ingrediente = ? && id_restaurante = ? && saldo_activo = 1 ORDER BY time_stamp ASC , id_orden ASC",
        [id_ingredient, id_restaurant]
      );

      if (cantidad_convertida > saldos[0].saldo_cantidad) {
        return res
          .status(200)
          .json({
            message: "No hay suficiente inventario",
            nombre_ingrediente: unidadMedidaIngrediente[0].nombre_ingrediente,
          });
      } else {
        return res.status(200).json({ message: "ok" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = {
  validateInventory,
};
