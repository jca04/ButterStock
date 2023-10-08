const { convertion, convertionPrice } = require("../utils/unitConversion");

const conn = require("../db/db");
const { v4: uuidv4 } = require("uuid");
const { queryAsync } = require("../utils/queryAsync");

const obtenerSaldo = (req, res) => {
  try {
    const { id_ingredient } = req.params;
    const id_restaurant = req.body.data.id;
    conn.query(
      "SELECT unidad_medida, costo_unitario, costo_total, cantidad_total_ingrediente, cantidad_editable_ingrediente FROM tbl_ingredientes WHERE id_ingrediente = ? && id_restaurant = ? && activo = 1",
      [id_ingredient, id_restaurant],
      (err, result) => {
        if (err) {
          return res.status(400).json({ message: err });
        } else {
          const costo_unitario_saldo = result[0].costo_unitario;
          const cantidad_total_saldo = result[0].cantidad_editable_ingrediente;
          const costo_total_saldo = costo_unitario_saldo * cantidad_total_saldo;
          conn.query(
            "INSERT INTO tbl_peps (id_peps, saldo_cantidad, saldo_valorUnitario, saldo_valorTotal, saldo_activo, id_ingrediente, id_restaurante) VALUES (?,?,?,?,?,?,?)",
            [
              uuidv4(),
              cantidad_total_saldo,
              costo_unitario_saldo,
              costo_total_saldo,
              1,
              id_ingredient,
              id_restaurant,
            ],
            (err, result) => {
              if (err) {
                return res.status(400).json({ message: err });
              } else {
                if (result.affectedRows > 0) {
                  res.status(200).json({ message: "Saldo ingresado" });
                }
              }
            }
          );
        }
      }
    );
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const entradas = (req, res) => {
  try {
    const { id_ingredient } = req.params;
    const id_restaurant = req.body.data.id;
    const { cantidad, costo_unitario, unidad_medida, detalle } = req.body.data;

    conn.query(
      "SELECT unidad_medida, costo_unitario, costo_total, cantidad_total_ingrediente, cantidad_editable_ingrediente FROM tbl_ingredientes WHERE id_ingrediente = ? && id_restaurant = ? && activo = 1",
      [id_ingredient, id_restaurant],
      async (err, result) => {
        if (err) {
          return res.status(400).json({ message: err });
        } else {
          // Traigo los saldos de la tabla peps para actualizar el costo unitario con el primer saldo que entre

          const saldos = await queryAsync(
            "SELECT saldo_cantidad, saldo_valorUnitario, saldo_valorTotal FROM tbl_peps WHERE id_ingrediente = ? && id_restaurante = ? && saldo_activo = 1 ORDER BY time_stamp ASC",
            [id_ingredient, id_restaurant]
          );

          const primer_saldo_valorUnitario = saldos[0].saldo_valorUnitario;

          const unidad_medida_ingrediente = result[0].unidad_medida;

          const cantidad_total_ingrediente =
            result[0].cantidad_total_ingrediente;

          const cantidad_editable_ingrediente =
            result[0].cantidad_editable_ingrediente;

          const cantidad_convertida = convertion(
            unidad_medida,
            cantidad,
            unidad_medida_ingrediente
          );

          const nueva_cantidad_total_ingrediente =
            cantidad_convertida + cantidad_total_ingrediente;
          const nueva_cantidad_editable_ingrediente =
            cantidad_convertida + cantidad_editable_ingrediente;

          const costo_unitario_por_unidad_medida = convertionPrice(
            unidad_medida,
            costo_unitario,
            unidad_medida_ingrediente
          );

          conn.query(
            "UPDATE tbl_ingredientes SET cantidad_total_ingrediente = ?, cantidad_editable_ingrediente = ?,  costo_unitario = ?, refresh = 1 WHERE id_ingrediente = ? && id_restaurant = ?",
            [
              nueva_cantidad_total_ingrediente,
              nueva_cantidad_editable_ingrediente,
              primer_saldo_valorUnitario,
              id_ingredient,
              id_restaurant,
            ],
            (err, result) => {
              if (err) {
                return res.status(400).json({ message: err });
              } else {
                if (result.affectedRows > 0) {
                  conn.query(
                    "INSERT INTO tbl_peps (id_peps, entrada_cantidad, entrada_valorUnitario, entrada_valorTotal, saldo_cantidad, saldo_valorUnitario, saldo_valorTotal, saldo_activo, detalle, id_ingrediente, id_restaurante) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                      uuidv4(),
                      cantidad_convertida,
                      costo_unitario_por_unidad_medida,
                      cantidad_convertida * costo_unitario_por_unidad_medida,
                      cantidad_convertida,
                      costo_unitario_por_unidad_medida,
                      cantidad_convertida * costo_unitario_por_unidad_medida,
                      1,
                      detalle,
                      id_ingredient,
                      id_restaurant,
                    ],
                    (err, result) => {
                      if (err) {
                        return res.status(400).json({ message: err });
                      } else {
                        if (result.affectedRows > 0) {
                          res.status(200).json({
                            message: "Entrada registrada",
                          });
                        }
                      }
                    }
                  );
                }
              }
            }
          );
        }
      }
    );
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const salidas = async (req, res) => {
  try {
    const { cantidad, unidad_medida } = req.body.data;
    const { id_ingredient } = req.params;
    const id_restaurant = req.body.data.id;

    if (!cantidad) {
      return res.status(400).json({ message: "No se ingresaron datos" });
    }

    // Traigo los datos del ingrediente
    const ingredientes_data = await queryAsync(
      "SELECT unidad_medida, cantidad_total_ingrediente, cantidad_editable_ingrediente FROM tbl_ingredientes WHERE id_ingrediente = ? && id_restaurant = ? && activo = 1",
      [id_ingredient, id_restaurant]
    );

    const unidad_medida_ingrediente = ingredientes_data[0].unidad_medida;
    const cantidad_convertida = convertion(
      unidad_medida,
      cantidad,
      unidad_medida_ingrediente
    );
    const cantidad_total_ingrediente =
      ingredientes_data[0].cantidad_total_ingrediente;
    const cantidad_editable_ingrediente =
      ingredientes_data[0].cantidad_editable_ingrediente;

    // Resto la cantidad que se va a sacar del inventario y lo actualizo en la tabla de ingredientes
    const nueva_cantidad_total_ingrediente =
      cantidad_total_ingrediente - cantidad_convertida;
    const nueva_cantidad_editable_ingrediente =
      cantidad_editable_ingrediente - cantidad_convertida;

    const actuaalizarIngredientes = await queryAsync(
      "UPDATE tbl_ingredientes SET cantidad_total_ingrediente = ?, cantidad_editable_ingrediente = ?, refresh = 1 WHERE id_ingrediente = ? && id_restaurant = ?",
      [
        nueva_cantidad_total_ingrediente,
        nueva_cantidad_editable_ingrediente,
        id_ingredient,
        id_restaurant,
      ]
    );

    if (actuaalizarIngredientes.affectedRows > 0) {
      // Traigo los saldos disponibles ordenados por fecha de ingreso
      const saldos = await queryAsync(
        "SELECT id_peps, saldo_cantidad, saldo_valorUnitario, saldo_valorTotal FROM tbl_peps WHERE id_ingrediente = ? && id_restaurante = ? && saldo_activo = 1 ORDER BY time_stamp ASC",
        [id_ingredient, id_restaurant]
      );

      // Obtengo el primer saldo que entro y el saldo siguiente
      const primerSaldo = saldos[0];
      const segundoSaldo = saldos[1];

      // Comparo si la cantidad que se va a sacar del inventario es mayor a la cantidad del primer saldo
      if (cantidad_convertida > primerSaldo.saldo_cantidad) {
        // Compruebe si hay un segundo saldo
        if (segundoSaldo) {
          // Ingreso la salida con la cantidad del primer saldo
          const salida = await queryAsync(
            "INSERT INTO tbl_peps (id_peps, salida_cantidad, salida_valorUnitario, salida_valorTotal, id_ingrediente, id_restaurante) VALUES (?, ?, ?, ?, ?, ?)",
            [
              uuidv4(),
              primerSaldo.saldo_cantidad,
              primerSaldo.saldo_valorUnitario,
              primerSaldo.saldo_valorTotal,
              id_ingredient,
              id_restaurant,
            ]
          );

          if (salida.affectedRows > 0) {
            // Resto la cantidad de salida con la cantidad del primer saldo para saber cuanto me queda por sacar, despues le resto a la cantidad del segundo saldo para saber cuanto me queda de saldo
            const restante = cantidad_convertida - primerSaldo.saldo_cantidad;
            const cantidadActual = segundoSaldo.saldo_cantidad - restante;
            const totalActual =
              cantidadActual * segundoSaldo.saldo_valorUnitario;

            // Calculo lo que va a ser la salida
            const cantidadSalida = segundoSaldo.saldo_cantidad - cantidadActual;
            const totalSalida =
              cantidadSalida * segundoSaldo.saldo_valorUnitario;

            // Actualizo el saldo_activo del primer saldo para que no se tome en cuenta
            const actualizarSaldo = await queryAsync(
              "UPDATE tbl_peps SET saldo_activo = 0 WHERE id_peps = ?",
              [primerSaldo.id_peps]
            );

            if (actualizarSaldo.affectedRows > 0) {
              // Ingreso la salida, el saldo y actualizo el saldo anterior para que no se tome en cuenta
              const nuevaSalida = await queryAsync(
                "INSERT INTO tbl_peps (id_peps, salida_cantidad, salida_valorUnitario, salida_valorTotal, id_ingrediente, id_restaurante) VALUES (?, ?, ?, ?, ?, ?)",
                [
                  uuidv4(),
                  cantidadSalida,
                  segundoSaldo.saldo_valorUnitario,
                  totalSalida,
                  id_ingredient,
                  id_restaurant,
                ]
              );

              if (nuevaSalida.affectedRows > 0) {
                // Ingreso el nuevo saldo
                const nuevoSaldo = await queryAsync(
                  "INSERT INTO tbl_peps (id_peps, saldo_cantidad, saldo_valorUnitario, saldo_valorTotal, saldo_activo, id_ingrediente, id_restaurante) VALUES (?, ?, ?, ?, ?, ?, ?)",
                  [
                    uuidv4(),
                    cantidadActual,
                    segundoSaldo.saldo_valorUnitario,
                    totalActual,
                    1,
                    id_ingredient,
                    id_restaurant,
                  ]
                );

                if (nuevoSaldo.affectedRows > 0) {
                  // Acutalizo el costo_unitario del ingrediente
                  await queryAsync(
                    "UPDATE tbl_ingredientes SET costo_unitario = ?, refresh = 1 WHERE id_ingrediente = ? && id_restaurant = ?",
                    [
                      segundoSaldo.saldo_valorUnitario,
                      id_ingredient,
                      id_restaurant,
                    ]
                  );
                  // Actualizo el estado del segundo saldo
                  await queryAsync(
                    "UPDATE tbl_peps SET saldo_activo = 0 WHERE id_peps = ?",
                    [segundoSaldo.id_peps]
                  );

                  // Verifico si hay mas saldos para insertarlos en la tabla de saldos
                  if (saldos.length > 2) {
                    const saldosRestantes = saldos.slice(2);
                    // Actualizo el estado de los saldos restantes y despues los inserto en la tabla de saldos
                    for (const saldo of saldosRestantes) {
                      const acutalizarSaldoRestante = await queryAsync(
                        "UPDATE tbl_peps SET saldo_activo = 0 WHERE id_peps = ?",
                        [saldo.id_peps]
                      );

                      if (acutalizarSaldoRestante.affectedRows > 0) {
                        await queryAsync(
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
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          return res
            .status(404)
            .json({ message: "no hay saldo suficiente para el cálculo" });
        }
      } else if (cantidad_convertida <= primerSaldo.saldo_cantidad) {
        // Aqui ya se calcula lo que va a ser la salida
        const cantidadActual = primerSaldo.saldo_cantidad - cantidad_convertida;
        const totalActual = cantidadActual * primerSaldo.saldo_valorUnitario;
        const totalSalida =
          cantidad_convertida * primerSaldo.saldo_valorUnitario;

        // Actualizo el costo_unitario de la tabla ingredientes
        const actualizarCostoUnitario = await queryAsync(
          "UPDATE tbl_ingredientes SET costo_unitario = ?, refresh = 1 WHERE id_ingrediente = ? && id_restaurant = ?",
          [primerSaldo.saldo_valorUnitario, id_ingredient, id_restaurant]
        );

        if (actualizarCostoUnitario.affectedRows > 0) {
          // Ingreso la salida, el saldo y actualizo el saldo anterior para que no se tome en cuenta
          const nuevaSalida = await queryAsync(
            "INSERT INTO tbl_peps (id_peps, salida_cantidad, salida_valorUnitario, salida_valorTotal, id_ingrediente, id_restaurante) VALUES (?, ?, ?, ?, ?, ?)",
            [
              uuidv4(),
              cantidad_convertida,
              primerSaldo.saldo_valorUnitario,
              totalSalida,
              id_ingredient,
              id_restaurant,
            ]
          );

          if (nuevaSalida.affectedRows > 0) {
            // Inserto el nuevo saldo

            if (cantidadActual !== 0) {
              const nuevoSaldo = await queryAsync(
                "INSERT INTO tbl_peps (id_peps, saldo_cantidad, saldo_valorUnitario, saldo_valorTotal, saldo_activo, id_ingrediente, id_restaurante) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [
                  uuidv4(),
                  cantidadActual,
                  primerSaldo.saldo_valorUnitario,
                  totalActual,
                  1,
                  id_ingredient,
                  id_restaurant,
                ]
              );
              if (nuevoSaldo.affectedRows > 0) {
                // Actualizo el estado del primer saldo
                const actualizarSaldo = await queryAsync(
                  "UPDATE tbl_peps SET saldo_activo = 0 WHERE id_peps = ?",
                  [primerSaldo.id_peps]
                );
                if (actualizarSaldo.affectedRows > 0) {
                  // Verifico si hay mas saldos para insertarlos en la tabla de saldos
                  if (saldos.length > 1) {
                    const saldosRestantes = saldos.slice(1);
                    // Actualizo el estado de los saldos restantes y despues los inserto en la tabla de saldos
                    for (const saldo of saldosRestantes) {
                      const acutalizarSaldoRestante = await queryAsync(
                        "UPDATE tbl_peps SET saldo_activo = 0 WHERE id_peps = ?",
                        [saldo.id_peps]
                      );

                      if (acutalizarSaldoRestante.affectedRows > 0) {
                        await queryAsync(
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
                      }
                    }
                  }
                }
              }
            } else {
              // Actualizo el estado del primer saldo
              const actualizarSaldo = await queryAsync(
                "UPDATE tbl_peps SET saldo_activo = 0 WHERE id_peps = ?",
                [primerSaldo.id_peps]
              );
              if (actualizarSaldo.affectedRows > 0) {
                // Verifico si hay mas saldos para insertarlos en la tabla de saldos
                const saldosRestantes = saldos.slice(1);
                // Actualizo el estado de los saldos restantes y despues los inserto en la tabla de saldos
                for (const saldo of saldosRestantes) {
                  const acutalizarSaldoRestante = await queryAsync(
                    "UPDATE tbl_peps SET saldo_activo = 0 WHERE id_peps = ?",
                    [saldo.id_peps]
                  );

                  if (acutalizarSaldoRestante.affectedRows > 0) {
                    await queryAsync(
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
                  }
                }
              }
            }
          }
        }
      }

      res.status(200).json({ message: "Salida registrada" });
    } else {
      res.status(400).json({
        message: "No se pudo actualizar el ingrediente",
      });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const kardexPeps = async (req, res) => {
  try {
    const { id_ingredient } = req.body.data;
    const { id_receta } = req.body.data;
    // const id_restaurant = req.body.data.id;

    if (!id_ingredient && id_receta) {
      const ingredientes = await queryAsync(
        "SELECT id_ingrediente FROM tbl_ingredientes_receta WHERE id_receta = ?",
        [id_receta]
      );

      const kardex_receta = [];

      for (const ingrediente of ingredientes) {
        const nombreIngrediente = await queryAsync(
          "SELECT nombre_ingrediente FROM tbl_ingredientes WHERE id_ingrediente = ?",
          [ingrediente.id_ingrediente]
        );
        // Traigo todo el kardex de cada ingrediente de la receta y lo guardo en un array de objetos con el nombre del ingrediente y el kardex

        const kardex = await queryAsync(
          "SELECT * FROM tbl_peps WHERE id_ingrediente = ? ORDER BY time_stamp ASC",
          [ingrediente.id_ingrediente]
        );

        const kardex_ingrediente = {
          ingrediente: nombreIngrediente[0].nombre_ingrediente,
          kardex: kardex,
        };

        kardex_receta.push(kardex_ingrediente);
      }
      res.status(200).json(kardex_receta);
    } else if (id_ingredient && !id_receta) {
      const nombreIngrediente = await queryAsync(
        "SELECT nombre_ingrediente FROM tbl_ingredientes WHERE id_ingrediente = ?",
        [id_ingredient]
      );

      const kardex = await queryAsync(
        "SELECT * FROM tbl_peps WHERE id_ingrediente = ? ORDER BY time_stamp ASC",
        [id_ingredient]
      );

      const kardex_ingrediente = {
        ingrediente: nombreIngrediente[0].nombre_ingrediente,
        kardex: kardex,
      };

      res.status(200).json(kardex_ingrediente);
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

module.exports = { entradas, kardexPeps, obtenerSaldo, salidas };
