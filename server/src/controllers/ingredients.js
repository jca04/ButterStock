const conn = require("../db/db");
const { v4: uuidv4 } = require("uuid");

const getIngredient = async (req, res) => {
  try {
    let id_restaurant = req.body.data.id;
    //Consulta a la tabla ingredientes para obtener su id y nombre y asi poder ingresarlo en la tabla tbl_ingredientes_receta, donde se pone que ingrediente va con esta receta
    conn.query(
      "SELECT i.nombre_ingrediente, i.id_ingrediente,  i.unidad_medida, i.cantidad_total_ingrediente FROM tbl_ingredientes AS i WHERE i.id_restaurant = ? && i.activo = 1 GROUP BY i.id_ingrediente ORDER BY i.time_stamp DESC;", [id_restaurant],(err, result) => {
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
              "unidad_medida" : result[i]["unidad_medida"],
              "cantidad_total_ingrediente" :result[i]["cantidad_total_ingrediente"]
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
