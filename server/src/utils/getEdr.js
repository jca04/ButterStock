const { queryAsync } = require("../utils/queryAsync");
const { convertion } = require("./unitConversion");

const querys = {
  costosPepsDaily:
    "SELECT entrada_valorTotal FROM tbl_peps WHERE " +
    "YEAR(time_stamp) = ? && MONTH(time_stamp) = ? && DAY(time_stamp) = ? && id_restaurante = ?",
  costosPepsMonthly:
    "SELECT entrada_valorTotal FROM tbl_peps WHERE " +
    "YEAR(time_stamp) = ? && MONTH(time_stamp) = ? && id_restaurante = ?",
  costosPromPondDaily:
    "SELECT entrada_valorTotal FROM tbl_promedio_ponderado WHERE " +
    "YEAR(time_stamp) = ? && MONTH(time_stamp) = ? && DAY(time_stamp) = ? && id_restaurante = ?",
  costosPromPondMonthly:
    "SELECT entrada_valorTotal FROM tbl_promedio_ponderado WHERE " +
    "YEAR(time_stamp) = ? && MONTH(time_stamp) = ? && id_restaurante = ?",

  ventasDaily:
    "SELECT * FROM tbl_ventas WHERE " +
    "YEAR(time_stamp) = ? && MONTH(time_stamp) = ? && DAY(time_stamp) = ? && id_restaurante = ?",

  ventasMonthly:
    "SELECT * FROM tbl_ventas WHERE " +
    "YEAR(time_stamp) = ? && MONTH(time_stamp) = ? && id_restaurante = ?",
};

const getEdr = async (fecha_edr, id_restaurante, fechaActualArr) => {
  try {
    if (
      fecha_edr?.toLowerCase() == "diario" ||
      fecha_edr == undefined ||
      fechaActualArr.length == 3
    ) {
      const costosPeps = await queryAsync(querys.costosPepsDaily, [
        fechaActualArr[0],
        fechaActualArr[1],
        fechaActualArr[2],
        id_restaurante,
      ]);

      const costosPromPond = await queryAsync(querys.costosPromPondDaily, [
        fechaActualArr[0],
        fechaActualArr[1],
        fechaActualArr[2],
        id_restaurante,
      ]);

      const ventas = await queryAsync(querys.ventasDaily, [
        fechaActualArr[0],
        fechaActualArr[1],
        fechaActualArr[2],
        id_restaurante,
      ]);

      const costos = costosPeps
        .concat(costosPromPond)
        .filter((costo) => costo.entrada_valorTotal !== null);

      const totalCostos = costos.reduce(
        (acc, costo) => acc + costo.entrada_valorTotal,
        0
      );
      const totalVentasReceta = [];
      const totalVentasIngrediente = [];

      for (const venta of ventas) {
        if (venta.tipo_venta == "receta") {
          const receta_info = await queryAsync(
            "SELECT costo_venta FROM tbl_inforeceta WHERE id_receta = ?",
            [venta.id_receta, id_restaurante]
          );
          for (const infoReceta of receta_info) {
            const precioReceta = infoReceta.costo_venta;
            const precioVenta = precioReceta * venta.cantidad_venta;
            totalVentasReceta.push(precioVenta);
          }
        } else {
          const infoIngrediente = await queryAsync(
            "SELECT unidad_medida, costo_unitario FROM tbl_ingredientes " +
              "WHERE id_ingrediente = ? && id_restaurant = ?",
            [venta.id_ingrediente, id_restaurante]
          );
          for (const info of infoIngrediente) {
            const conversionCantidad = convertion(
              venta.unidad_medida_venta,
              venta.cantidad_venta,
              info.unidad_medida
            );
            const precioCantIngrediente =
              conversionCantidad * info.costo_unitario;
            totalVentasIngrediente.push(precioCantIngrediente);
          }
        }
      }

      const totalVentas =
        totalVentasReceta.reduce((acc, venta) => acc + venta, 0) +
        totalVentasIngrediente.reduce((acc, venta) => acc + venta, 0);

      const total = {
        totalCostos: parseInt(totalCostos),
        totalVentas: parseInt(totalVentas),
      };

      return total;
    } else {
      const costosPeps = await queryAsync(querys.costosPepsMonthly, [
        fechaActualArr[0],
        fechaActualArr[1],
        id_restaurante,
      ]);
      const costosPromPond = await queryAsync(querys.costosPromPondMonthly, [
        fechaActualArr[0],
        fechaActualArr[1],
        id_restaurante,
      ]);

      const costos = costosPeps
        .concat(costosPromPond)
        .filter((costo) => costo.entrada_valorTotal !== null);

      const ventas = await queryAsync(querys.ventasMonthly, [
        fechaActualArr[0],
        fechaActualArr[1],
        id_restaurante,
      ]);

      const totalCostos = costos.reduce(
        (acc, costo) => acc + costo.entrada_valorTotal,
        0
      );
      const totalVentasReceta = [];
      const totalVentasIngrediente = [];

      for (const venta of ventas) {
        if (venta.tipo_venta == "receta") {
          const receta_info = await queryAsync(
            "SELECT costo_venta FROM tbl_inforeceta WHERE id_receta = ?",
            [venta.id_receta, id_restaurante]
          );
          for (const infoReceta of receta_info) {
            const precioReceta = infoReceta.costo_venta;
            const precioVenta = precioReceta * venta.cantidad_venta;
            totalVentasReceta.push(precioVenta);
          }
        } else {
          const infoIngrediente = await queryAsync(
            "SELECT unidad_medida, costo_unitario FROM tbl_ingredientes " +
              "WHERE id_ingrediente = ? && id_restaurant = ?",
            [venta.id_ingrediente, id_restaurante]
          );
          for (const info of infoIngrediente) {
            const conversionCantidad = convertion(
              venta.unidad_medida_venta,
              venta.cantidad_venta,
              info.unidad_medida
            );
            const precioCantIngrediente =
              conversionCantidad * info.costo_unitario;
            totalVentasIngrediente.push(precioCantIngrediente);
          }
        }
      }

      const totalVentas =
        totalVentasReceta.reduce((acc, venta) => acc + venta, 0) +
        totalVentasIngrediente.reduce((acc, venta) => acc + venta, 0);

      const total = {
        totalCostos: parseInt(totalCostos),
        totalVentas: parseInt(totalVentas),
      };

      return total;
    }
  } catch (error) {
    return error;
  }
};

module.exports = {
  getEdr,
};
