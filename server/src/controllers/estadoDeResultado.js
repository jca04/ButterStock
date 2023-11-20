const { queryAsync } = require("../utils/queryAsync");
const { v4: uuidv4 } = require("uuid");
const { convertion } = require("../utils/unitConversion");

let rutaLlamada = false;

const getEdr = async (req, res) => {
  try {
    const fecha = new Date();
    const uuid = uuidv4();
    const fechaInicial = new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDate(),
      0,
      0,
      0
    ); // Comienzo del día
    const fechaFinal = new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDate(),
      23,
      59,
      59
    ); // Fin del día

    if (!req || !res) {
      const restaurantes = await queryAsync(
        "SELECT id_restaurant FROM tbl_restaurant"
      );
      for (const i of restaurantes) {
        const edr = await queryAsync(
          "SELECT id_estado_resultado FROM tbl_estado_resultado WHERE id_restaurante = ? && time_stamp BETWEEN ? AND ?",
          [i.id_restaurant, fechaInicial, fechaFinal]
        );

        if (edr.length === 0) {
          const costosPeps = await queryAsync(
            "SELECT entrada_valorTotal, id_restaurante FROM tbl_peps WHERE id_restaurante = ? && time_stamp BETWEEN ? AND ?",
            [i.id_restaurant, fechaInicial, fechaFinal]
          );

          const costosPromPond = await queryAsync(
            "SELECT entrada_valorTotal, id_restaurante FROM tbl_promedio_ponderado WHERE id_restaurante = ? && time_stamp BETWEEN ? AND ?",
            [i.id_restaurant, fechaInicial, fechaFinal]
          );

          const ventas = await queryAsync(
            "SELECT * FROM tbl_ventas WHERE id_restaurante = ? && time_stamp BETWEEN ? AND ?",
            [i.id_restaurant, fechaInicial, fechaFinal]
          );

          const costos = costosPeps.concat(costosPromPond);
          const newCostos = costos.filter(
            (costo) => costo.entrada_valorTotal !== null
          );

          const totalCostos = {}; // {id_restaurante: totalCosto} Aqui estan los restaurantes junto a la cantidad de costos que tienen
          const totalVentas = {}; // {id_restaurante: totalVenta} Aqui estan los restaurantes junto a la cantidad de ventas que tienen

          for (const costo of newCostos) {
            if (totalCostos[costo.id_restaurante] === undefined) {
              totalCostos[costo.id_restaurante] = costo.entrada_valorTotal;
            } else {
              totalCostos[costo.id_restaurante] += costo.entrada_valorTotal;
            }
          }

          for (const venta of ventas) {
            if (venta.tipo_venta == "receta") {
              const cantidad = venta.cantidad_venta;
              const receta_info = await queryAsync(
                "SELECT costo_venta FROM tbl_inforeceta WHERE id_receta = ?",
                [venta.id_receta]
              );
              for (const infoReceta of receta_info) {
                const precioReceta = infoReceta.costo_venta;
                const precioVenta = precioReceta * cantidad;
                if (totalVentas[venta.id_restaurante] === undefined) {
                  totalVentas[venta.id_restaurante] = precioVenta;
                } else {
                  totalVentas[venta.id_restaurante] += precioVenta;
                }
              }
            } else {
              const infoIngrediente = await queryAsync(
                "SELECT unidad_medida, costo_unitario FROM tbl_ingredientes WHERE id_ingrediente = ?",
                [venta.id_ingrediente]
              );
              for (const info of infoIngrediente) {
                const conversionCantidad = convertion(
                  venta.unidad_medida_venta,
                  venta.cantidad_venta,
                  info.unidad_medida
                );
                const precioCantIngrediente =
                  conversionCantidad * info.costo_unitario;
                if (totalVentas[venta.id_restaurante] === undefined) {
                  totalVentas[venta.id_restaurante] = precioCantIngrediente;
                } else {
                  totalVentas[venta.id_ingrediente] += precioCantIngrediente;
                }
              }
            }
          }

          const total = {}; // {id_restaurante: total} Aqui estan los restaurantes junto a la cantidad de costos que tienen
          for (const id in totalCostos) {
            if (totalVentas[id] !== undefined) {
              total[id] = {
                costos: totalCostos[id],
                ventas: totalVentas[id],
              };
            }
          }

          // Utilidad
          for (const idRestaurant in total) {
            const utilidad =
              total[idRestaurant].ventas - total[idRestaurant].costos;
            total[idRestaurant] = {
              ...total[idRestaurant],
              utilidad,
            };
          }

          for (const i in total) {
            await queryAsync(
              "INSERT INTO tbl_estado_resultado (id_estado_resultado, ventas, costos, utilidad, automatico, id_restaurante) " +
                "VALUES (?, ?, ?, ?, ?, ?)",
              [uuid, total[i].ventas, total[i].costos, total[i].utilidad, 1, i]
            );
          }
        }
      }
    } else {
      rutaLlamada = true;
      res.status(200).json({ message: "Hello world" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getEdr,
  rutaLlamada,
};
