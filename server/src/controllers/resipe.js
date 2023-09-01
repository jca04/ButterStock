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

     let response =  conn.query("INSERT INTO tbl_recetas (id_receta, nombre_receta, imagen, descripcion,cantidad_plato, activo, sub_receta, tipo_receta, id_restaurant ) VALUES(?,?,?,?,?,?,?,?,?)", [id_receta_new, nombre_receta,imagen,descripcion,cantidad_plato,1, hasRecetaPadre, tipoPlato, id_restaurant], 
      (err, result) => {
        if (err){
          return err;
        }
        return true;
      });


      if (response){
        let arrnew = []

        for (var i in ingredient){
          let id_ingrediente = ingredient[i][0];
          let cantidad_ingrediente_plato = ingredient[i][1];
          let unidad_medida_r = ingredient[i][2];
          arrnew.push([uuidv4(), unidad_medida_r, cantidad_ingrediente_plato, 1, id_ingrediente, id_receta_new])
        }

        if (arrnew.length > 0){
          conn.query("INSERT INTO tbl_ingredientes_receta (id_ingrediente_receta, unidad_medida_r,  cantidad_por_receta, activo,   id_ingrediente, id_receta) VALUES ?",
          [arrnew], 
          (err, resultdata) => {
            if (err){
              res.status(500).json({message: err});
            }
  
            if (resultdata.affectedRows !== undefined){
              res.status(200).json({message: true});
            }
          });
        }else{
          res.status(200).json({message: true});
        }
      }else{
        res.status(500).json({message: response});
      }

    } 
  } catch (error) {
    res.status(500).json({message: error})
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
        let arrConcat = [];
        for (var i in result){
          arrConcat.push(result[i].id_receta);
        }
        
        if (arrConcat.length > 0){
          let parseData = "" + arrConcat.join("\",\"") + "";
          
          conn.query('SELECT * FROM tbl_ingredientes_receta WHERE id_receta IN ("'+parseData+'") && activo = 1;',
           (err, resultIn) => {
            if (err){
              res.status(400).json({ message: err });
            }

            if (Array.isArray(resultIn)){
              //comparar datos para entregar con sus respectivos ingredientes
              for (var i in result){
                let id_receta = result[i].id_receta;
                let arrLocal = [];
                for (var f in resultIn){
                  if (resultIn[f].id_receta == id_receta){
                    arrLocal.push(resultIn[f]);
                  }
                }
                // console.log(arrLocal)
                result[i].ingredientes = arrLocal;

              }
            }
            res.status(200).json({ result });

              // console.log(result)
           })
        }else{
          res.status(200).json({ result });
        }
      }
    });
    
  } catch (error) {
      res.status(500).json({message: error});
  }
}; 


const getResipeLimit = (req, res) => {
  try {
    let {data} = req.body;
    let id_restaurant = data.data;

    conn.query("SELECT * FROM tbl_recetas  WHERE id_restaurant = ? && activo = 1 ORDER BY tbl_recetas.time_stamp DESC LIMIT 1", [id_restaurant],
      (err, result) => {
        if (err){
          res.status(500).json({message:err})
        }

        if (result.length > 0){
          res.status(200).json({response: result});
        }else{
          res.status(200).json({response: result});
        }
     });

  } catch (error) {
    res.status(500).json({message: error});
  }
}

module.exports = {
  createEditResipe,
  getAllResipePerUser,
  getResipeLimit
};
