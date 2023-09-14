const conn = require("../db/db");
const { v4: uuidv4 } = require("uuid");

const getIngredient = async (req, res) => {
  try {
    let id_restaurant = req.body.data.id;
    //Consulta a la tabla ingredientes para obtener su id y nombre y asi poder ingresarlo en la tabla tbl_ingredientes_receta, donde se pone que ingrediente va con esta receta
    conn.query(
      "SELECT i.nombre_ingrediente, i.id_ingrediente,  i.unidad_medida, i.cantidad_total_ingrediente, i.costo_total, i.cantidad_editable_ingrediente FROM tbl_ingredientes AS i WHERE i.id_restaurant = ? && i.activo = 1 GROUP BY i.id_ingrediente ORDER BY i.time_stamp DESC;",
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
      cantidad_porcion_elaborar,
      costo_total,
      porcentaje_participacion,
      cantidad_total_ingrediente,
    } = req.body;

    conn.query(
      "INSERT INTO tbl_ingredientes (id_ingrediente, codigo_identificador, nombre_ingrediente, unidad_medida, costo_unitario,  cantidad_procion_elaborar, costo_total, porcentaje_participacion, cantidad_total_ingrediente, activo, id_restaurant) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        uuidv4(),
        uuidv4(),
        nombre_ingrediente,
        unidad_medida,
        costo_unitario,
        cantidad_porcion_elaborar,
        costo_total,
        porcentaje_participacion,
        cantidad_total_ingrediente,
        1,
        "5959837d-7e15-40c1-abdd-4224a9c3ad9c",
      ]
    );
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const getIngredientsWithRecipe = (req, res) => {
  try {
    // , && i.activo = 1 && r.id_restaurant = ? && r.activo = 1 && ir.activo = 1
    // r.activo

    const id_restaurant = req.body.data.id;
    conn.query(
      "SELECT i.nombre_ingrediente, i.id_ingrediente, i.unidad_medida, " +
        "i.costo_unitario, i.costo_total, i.porcentaje_participacion, " +
        "i.cantidad_procion_elaborar, i.cantidad_total_ingrediente, i.activo, " +
        "r.nombre_receta, r.imagen, r.cantidad_plato,  " +
        "r.sub_receta, ir.cantidad_por_receta " +
        "FROM tbl_ingredientes AS i " +
        "LEFT JOIN tbl_ingredientes_receta AS ir ON i.id_ingrediente = ir.id_ingrediente " +
        "LEFT JOIN tbl_recetas AS r ON r.id_receta = ir.id_receta " +
        "WHERE i.id_restaurant = ? AND (r.id_restaurant = ? OR r.id_receta IS NULL) " +
        "ORDER BY i.time_stamp ASC;",
      [id_restaurant, id_restaurant],
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
                  cantidad_porcion_elaborar: row.cantidad_procion_elaborar,
                  costo_total: row.costo_total,
                  porcentaje_participacion: row.porcentaje_participacion,
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
                  cantidad_por_receta: row.cantidad_por_receta,
                });
              } else {
                ingredientes[idIngrediente].recetas = [];
              }
            });
            res.status(200).json({ ingredientes: Object.values(ingredientes) });
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

const banIngredient = (req, res) => {
  try {
    const { id } = req.body;

    conn.query(
      "UPDATE tbl_ingredientes SET activo = 0 WHERE id_ingrediente = ?",
      [id],
      (err, result) => {
        if (err) {
          res.status(400).json({ message: err });
        } else {
          res.status(200).json({ message: "Ingrediente eliminado" });
        }
      }
    );
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

module.exports = {
  getIngredient,
  createIngredient,
  getIngredientsWithRecipe,
  banIngredient,
  unbanIngredient,
};
