const conn = require("../db/db");
const { v4: uuidv4 } = require("uuid");

const getIngredient = async (req, res) => {
  try {
    let id_user = req.user.id;
    conn.query(
      "SELECT tbl_ingredientes_receta.* FROM tbl_ingredientes_receta INNER JOIN tbl_recetas AS r ON r.id_receta = tbl_ingredientes_receta.id_receta INNER JOIN tbl_users AS u ON u.id_restaurant = r.id_restaurant WHERE tbl_ingredientes_receta.activo = 1 && u.id_users = ?", [id_user],(err, result) => {
        if (err) {
          res.status(400).json({ message: err }); 
        }

        if (result.length > 0 || result.length == 0) {
          res.status(200).json({ result });
        }
      }
    );
  } catch (error) {
    res.status(400).json({ message: error});
  }
};

module.exports = {
  getIngredient,
};
