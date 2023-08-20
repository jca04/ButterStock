const conn = require("../db/db");
const { v4: uuidv4 } = require("uuid");

const getIngredient = async (req, res) => {
  try {
    let id_restaurant = req.body.data.id;
    //Consulta a la tabla ingredientes para obtener su id y nombre y asi poder ingresarlo en la tabla tbl_ingredientes_receta, donde se pone que ingrediente va con esta receta
    conn.query(
      "SELECT i.nombre_ingrediente, tbl_ingredientes_receta.id_ingrediente, tbl_ingredientes_receta.id_receta, i.unidad_medida FROM tbl_ingredientes_receta INNER JOIN tbl_ingredientes AS i ON tbl_ingredientes_receta.id_ingrediente = i.id_ingrediente WHERE tbl_ingredientes_receta.id_restaurant = ? GROUP BY tbl_ingredientes_receta.id_ingrediente ORDER BY tbl_ingredientes_receta.time_stamp DESC;", [id_restaurant],(err, result) => {
        if (err) {
          res.status(400).json({ message: err }); 
        }

        if (result.length > 0 || result.length == 0) {
          //editar los datos para que lleguen como {label: "" , value:"sad"} para el select
          for (var i in result){
            result[i] = {
              "label" : result[i]['nombre_ingrediente'],
              "value" : result[i]["id_ingrediente"],
              "id_receta" : result[i]["id_receta"],
              "unidad_medida" : result[i]["unidad_medida"]
            };
          }
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
