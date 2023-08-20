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
          let arr = [];
          for (var i in ingredient){
            arr.push([uuidv4(), ingredient[i].unidad_medida, 1, ingredient[i].value, id_receta_new, id_restaurant]);
          }
          console.log(arr)


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
