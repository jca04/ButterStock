const { queryAsync } = require("../utils/queryAsync");
const { v4: uuidv4 } = require("uuid");
const { convertion } = require("../utils/unitConversion");
const dayjs = require("dayjs");
const { getEdr } = require("../utils/getEdr");

const edrAutomatico = async (req, res) => {
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const pruebaFecha = async (req, res) => {
  try {
    const fecha = "2023-11-19";
    const fechaArr = fecha.split("-");
    const edr = await queryAsync(
      "SELECT * FROM tbl_estado_resultado WHERE DATE(MONTH(time_stamp)) = ? && DATE(YEAR(time_stamp)) = ?",
      [fechaArr[1], fechaArr[0]]
    );
    res.status(200).json({ edr });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const edr = async (req, res) => {
  try {
    const { gastos, id_restaurant, fecha_edr } = req.body.data;

    const uuid = uuidv4();
    const fecha = new Date();
    const fechaActual = dayjs(fecha).format("YYYY-MM-DD"); // Fecha actual
    const fechaActualArr = fechaActual.split("-");
    const valoresGastos = Object.values(gastos);
    const sumaGastos = valoresGastos.reduce((acc, cur) => acc + cur, 0); // Suma de todos los gastos
    const gastosJSON = JSON.stringify(gastos);

    const alreadyHaveEdr = await queryAsync(
      "SELECT id_estado_resultado FROM tbl_estado_resultado WHERE " +
        "YEAR(time_stamp) = ? && MONTH(time_stamp) = ? && DAY(time_stamp) = ? && id_restaurante = ?",
      [fechaActualArr[0], fechaActualArr[1], fechaActualArr[2], id_restaurant]
    );

    if (alreadyHaveEdr.length > 0) {
      return res
        .status(200)
        .json({ message: "Ya el estado de resultado fue creado" });
    }

    const calculoEdr = await getEdr(fecha_edr, id_restaurant, fechaActualArr);

    const utilidad =
      calculoEdr.totalVentas - calculoEdr.totalCostos - sumaGastos;

    const insertEdr = await queryAsync(
      "INSERT INTO tbl_estado_resultado (id_estado_resultado, ventas, costos, otros_gastos, otros_gastos_valor, utilidad, automatico, id_restaurante) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        uuid,
        calculoEdr.totalVentas,
        calculoEdr.totalCostos,
        gastosJSON,
        sumaGastos,
        utilidad,
        0,
        id_restaurant,
      ]
    );

    if (insertEdr.affectedRows === 0) {
      return res.status(400).json({ message: "No se pudo crear el EDR" });
    }

    res.status(200).json({ message: "EDR creado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEdrByDate = async (req, res) => {
  try {
    const { id_restaurant, fecha_edr } = req.body.data;
    const fechaArr = fecha_edr.split("-");

    let edr;

    if (fechaArr.length == 2) {
      edr = await queryAsync(
        "SELECT * FROM tbl_estado_resultado WHERE YEAR(time_stamp) = ? && MONTH(time_stamp) = ? && id_restaurante = ?",
        [parseInt(fechaArr[0]), parseInt(fechaArr[1]), id_restaurant]
      );
    } else if (fechaArr.length == 3) {
      edr = await queryAsync(
        "SELECT * FROM tbl_estado_resultado WHERE YEAR(time_stamp) = ? && MONTH(time_stamp) = ? && DAY(time_stamp) = ? && id_restaurante = ?",
        [
          parseInt(fechaArr[0]),
          parseInt(fechaArr[1]),
          parseInt(fechaArr[2]),
          id_restaurant,
        ]
      );
    }

    res.status(200).json({ edr });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEdrData = async (req, res) => {
  try {
    const { id_restaurant, tipoEdr } = req.body.data;

    const fecha = new Date();
    const fechaActual = dayjs(fecha).format("YYYY-MM-DD"); // Fecha actual

    const fechaActualArr = fechaActual.split("-");
    const mesFechaActual = `${fechaActualArr[0]}-${fechaActualArr[1]}`.split(
      "-"
    );

    const fechaEdr = tipoEdr == "diario" ? fechaActualArr : mesFechaActual;

    const getData = await getEdr(tipoEdr, id_restaurant, fechaEdr);

    res.status(200).json({ message: "ok", getData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPieChartEdr = async (req, res) => {
  try {
    const { id_restaurant } = req.body.data;

    const fecha = new Date();
    const fechaActual = dayjs(fecha).format("YYYY-MM-DD"); // Fecha actual
    const fechaActualArr = fechaActual.split("-");

    const edrMensual = await queryAsync(
      "SELECT * FROM tbl_estado_resultado WHERE id_restaurante = ? && YEAR(time_stamp) = ? && MONTH(time_stamp) = ?",
      [id_restaurant, fechaActualArr[0], fechaActualArr[1]]
    );

    const sumaVentas = edrMensual.reduce((acc, cur) => acc + cur.ventas, 0);
    const sumaCostos = edrMensual.reduce((acc, cur) => acc + cur.costos, 0);
    const sumaOtrosGastos = edrMensual.reduce(
      (acc, cur) => acc + cur.otros_gastos_valor,
      0
    );

    const data = {
      ventas: sumaVentas,
      costos: sumaCostos,
      otrosGastos: sumaOtrosGastos,
    };

    res.status(200).json({ message: "ok", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllEdr = async (req, res) => {
  try {
    const { id_restaurant } = req.params;
    const edrs = await queryAsync(
      "SELECT * FROM tbl_estado_resultado WHERE id_restaurante = ?",
      [id_restaurant]
    );
    res.status(200).json({ message: "ok", edrs });
  } catch (error) {
    res.statur(500).json({ error: error.message });
  }
};

module.exports = {
  edrAutomatico,
  pruebaFecha,
  edr,
  getEdrByDate,
  getEdrData,
  getPieChartEdr,
  getAllEdr,
};
