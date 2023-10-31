const conn = require("../db/db");
const { v4: uuidv4 } = require("uuid");
const { refreshResipes } = require("./refreshResipe");
const { queryAsync } = require("../utils/queryAsync");

const getIngredient = async (req, res) => {
  try {
    let id_restaurant = req.body.data.id;
    //Consulta a la tabla ingredientes para obtener su id y nombre y asi poder ingresarlo en la tabla tbl_ingredientes_receta, donde se pone que ingrediente va con esta receta
    conn.query(
      "SELECT i.nombre_ingrediente, i.id_ingrediente,  i.unidad_medida, i.cantidad_total_ingrediente, i.costo_total, i.cantidad_editable_ingrediente, i.costo_unitario FROM tbl_ingredientes AS i WHERE i.id_restaurant = ? && i.activo = 1 GROUP BY i.id_ingrediente ORDER BY i.time_stamp DESC;",
      [id_restaurant],
      (err, result) => {
        if (err) {
          res.status(400).json({ message: err });
        }
        if (result.length > 0 || result.length == 0) {
          //editar los datos para que lleguen como {label: "" , value:"sad"} para el select
          for (var i in result) {
            result[i] = {
              label: result[i]["nombre_ingrediente"],
              value: result[i]["id_ingrediente"],
              id_receta: result[i]["id_receta"],
              unidad_medida: result[i]["unidad_medida"],
              cantidad_total_ingrediente:
                result[i]["cantidad_total_ingrediente"],
              costo_total: result[i]["costo_total"],
              cantidad_editable_ingrediente:
                result[i]["cantidad_editable_ingrediente"],
              costo_unitario: result[i]["costo_unitario"],
            };
          }

          res.status(200).json({ result });
        }
      }
    );
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const createIngredient = async (req, res) => {
  try {
    const {
      nombre_ingrediente,
      unidad_medida,
      costo_unitario,
      cantidad_total_ingrediente,
      costo_total,
      kardex,
    } = req.body.data;

    const id_restaurant = req.body.id;
    const id_ingrediente = uuidv4();

    conn.query(
      "INSERT INTO tbl_ingredientes (id_ingrediente, nombre_ingrediente, unidad_medida, costo_unitario, costo_total, cantidad_total_ingrediente, cantidad_editable_ingrediente,activo, kardex ,id_restaurant) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
      [
        id_ingrediente,
        nombre_ingrediente,
        unidad_medida,
        costo_unitario,
        costo_total,
        cantidad_total_ingrediente,
        cantidad_total_ingrediente,
        1,
        kardex,
        id_restaurant,
      ],
      async (err, result) => {
        if (err) {
          return res.status(400).json({ message: err });
        } else {
          if (result.affectedRows > 0) {
            if (kardex == "PEPS") {
              const costo_total_saldo =
                cantidad_total_ingrediente * costo_unitario;
              conn.query(
                "INSERT INTO tbl_peps (id_peps, saldo_cantidad, saldo_valorUnitario, saldo_valorTotal, saldo_activo, id_ingrediente, id_restaurante) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [
                  uuidv4(),
                  cantidad_total_ingrediente,
                  costo_unitario,
                  costo_total_saldo,
                  1,
                  id_ingrediente,
                  id_restaurant,
                ],
                (err, result) => {
                  if (err) {
                    return res.status(400).json({ message: err });
                  }
                }
              );
            } else {
              const costo_total_saldo =
                cantidad_total_ingrediente * costo_unitario;
              await queryAsync(
                "INSERT INTO tbl_promedio_ponderado (id_promedio_ponderado, saldo_cantidad, saldo_valorUnitario, saldo_valorTotal, saldo_activo, id_ingrediente, id_restaurante) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [
                  uuidv4(),
                  cantidad_total_ingrediente,
                  costo_unitario,
                  costo_total_saldo,
                  1,
                  id_ingrediente,
                  id_restaurant,
                ]
              );
            }

            return res.status(200).json({
              message: "Ingrediente creado",
              id_ingrediente,
            });
          } else {
            return res.status(400).json({
              message: "No se pudo crear el ingrediente",
            });
          }
        }
      }
    );
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const getIngredientsWithRecipe = (req, res) => {
  try {
    const id_restaurant = req.body.data.id;
    conn.query(
      "SELECT i.nombre_ingrediente, i.id_ingrediente, i.unidad_medida, " +
        "i.costo_unitario, i.costo_total, " +
        "i.cantidad_total_ingrediente, i.activo, i.kardex, " +
        "r.id_receta, r.nombre_receta, r.imagen, r.cantidad_plato,  " +
        "r.sub_receta, ir.cantidad_por_receta, " +
        "ir.unidad_medida_r " +
        "FROM tbl_ingredientes AS i " +
        "LEFT JOIN tbl_ingredientes_receta AS ir ON i.id_ingrediente = ir.id_ingrediente " +
        "LEFT JOIN tbl_recetas AS r ON r.id_receta = ir.id_receta " +
        "WHERE i.id_restaurant = ? && i.activo = 1 " +
        "ORDER BY i.time_stamp ASC;",
      [id_restaurant],
      (err, result) => {
        if (err) {
          res.status(400).json({ message: err });
        } else {
          if (result.length > 0) {
            const ingredientes = {};
            result.forEach((row) => {
              const idIngrediente = row.id_ingrediente;
              if (!ingredientes[idIngrediente]) {
                ingredientes[idIngrediente] = {
                  id_ingrediente: idIngrediente,
                  nombre_ingrediente: row.nombre_ingrediente,
                  unidad_medida: row.unidad_medida,
                  cantidad_total_ingrediente: row.cantidad_total_ingrediente,
                  ingrediente_activo: row.activo,
                  costo_unitario: row.costo_unitario,
                  costo_total: row.costo_total,
                  kardex: row.kardex,
                  recetas: [],
                };
              }
              if (row.id_receta != null) {
                ingredientes[idIngrediente].recetas.push({
                  id_receta: row.id_receta,
                  nombre_receta: row.nombre_receta,
                  imagen: row.imagen,
                  cantidad_plato: row.cantidad_plato,
                  sub_receta: row.sub_receta,
                  cantidad_por_receta:
                    row.cantidad_por_receta + " " + row.unidad_medida_r,
                  kardex: row.kardex,
                });
              } else {
                ingredientes[idIngrediente].recetas = [];
              }
            });
            res.status(200).json({
              ingredientes: Object.values(ingredientes),
            });
          } else {
            res.status(400).json({ message: "No hay ingredientes" });
          }
        }
      }
    );
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

//desactivar un ingrediente
const banIngredient = async (req, res) => {
  try {
    const { id } = req.body;

    const update = await refreshResipes(id, "delete");

    if (update.message == "OK") {
      res.status(200).json({ message: "Ingrediente eliminado" });
    } else {
      res.status(400).json({ message: "Ha ocurrido un erro inesperado" });
    }
    console.log(update);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const unbanIngredient = (req, res) => {
  try {
    const { id } = req.body;
    conn.query(
      "UPDATE tbl_ingredientes SET activo = 1 WHERE id_ingrediente = ?",
      [id],
      (err, result) => {
        if (err) {
          res.status(400).json({ message: err });
        } else {
          res.status(200).json({ message: "Ingrediente activado" });
        }
      }
    );
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

//funcion que actualiza los datos de los ingredientes
//por el momento solo actualiza el nombre y el kardex
const updateIngredients = async (req, res) => {
  try {
    const { data, id } = req.body;
    const {
      nombre_ingrediente,
      unidad_medida,
      costo_unitario,
      cantidad_total_ingrediente,
      costo_total,
      kardex,
    } = data;

    conn.query(
      "UPDATE tbl_ingredientes SET nombre_ingrediente = ?, kardex = ? WHERE id_ingrediente = ?",
      [nombre_ingrediente, kardex, id],
      (err, result) => {
        try {
          if (err) {
            res.status(400).json({ message: "No se pudo actualizar" });
          }

          if (result.affectedRows > 0) {
            res
              .status(200)
              .json({ message: "Se ha actualizado correctamente" });
          } else {
            res.status(400).json({ message: "No se pudo actualizar" });
          }
        } catch (error) {
          res.status(400).json({ message: "No se pudo actualizar" });
        }
      }
    );
  } catch (error) {
    res.status(400).json({ message: "Ha ocurrido un error inesperado" });
  }
};

module.exports = {
  getIngredient,
  createIngredient,
  getIngredientsWithRecipe,
  banIngredient,
  unbanIngredient,
  updateIngredients,
};
