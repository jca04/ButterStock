const conn = require("../db/db");
const { v4: uuidv4 } = require("uuid");

const createEditResipe = async (req, res) => {
  try {
    let {id_receta , nombre_receta, descripcion, tipoPlato, cantidad_plato, ingredient, recetaPadre, id_restaurant, imagen} = req.body.data.data;
    let id_receta_new = uuidv4();
    //Insertar una nueva receta
    if (id_receta == ''){
      let hasRecetaPadre = 0;
      if (recetaPadre.length > 0){
        hasRecetaPadre = 1;
      }

      conn.query("INSERT INTO tbl_recetas (id_receta, nombre_receta, imagen, descripcion,cantidad_plato, activo, sub_receta, tipo_receta, id_restaurant ) VALUES(?,?,?,?,?,?,?,?,?)", [id_receta_new, nombre_receta,imagen,descripcion,cantidad_plato,1, hasRecetaPadre, tipoPlato, id_restaurant], 
      (err, result) => {
        if (err){
          res.status(400).json({message: err})
        }

        if (result.affectedRows == 1){
          //insertar los datos de los ingredientes en tbl_ingredientes receta para relacionar esta receta con los ingredientes
          console.log(ingredient)
          //ingredient [[id_ingrediente, cantidad_ingrediente en el plato, gramage]]

          for (var i in ingredient){
            let id_ingrediente = ingredient[i][0];
            let cantidad_ingrediente_plato = ingredient[i][1];
            let unidad_medida_r = ingredient[i][2];

            conn.query("INSERT INTO tbl_ingredientes_receta (id_ingrediente_receta, unidad_medida_r,  cantidad_por_receta, activo, id_ingrediente, id_receta) VALUES (?,?,?,?,?,?)",
            [uuidv4(), unidad_medida_r, cantidad_ingrediente_plato, 1, id_ingrediente, id_receta_new], 
            (err, result) => {
              if (err){
                return res.json({result: false})
              }
            });
          }

          
          if (result.affectedRows == 1){
            res.status(200).json({result: true})
          }
        }
      })
    } 
  } catch (error) {
    console.log(error)
  }
};

const getAllResipePerUser =  (req, res) => {
  try {
    let {data} = req.body;
    let id = data.id;
    conn.query("SELECT * FROM tbl_recetas  WHERE id_restaurant = ? && activo = 1 ORDER BY tbl_recetas.time_stamp DESC", [id], (err, result) => {

      if (err) {
        res.status(400).json({ message: err });
      }

      if (result.length > 0 || result.length == 0) {
        res.status(200).json({ result });
      }
    });
    
  } catch (error) {
      res.status(500).json({message: error});
  }
}; 

module.exports = {
  createEditResipe,
  getAllResipePerUser
};
