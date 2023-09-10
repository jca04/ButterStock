const conn = require("../db/db");
const { v4: uuidv4 } = require("uuid");

const createEditResipe = async (req, res) => {
  try {
    let {id_receta , nombre_receta, descripcion, tipoPlato, cantidad_plato, ingredientes, sub_receta , id_restaurant, imagen, isSubreceta } = req.body.data.data;
    let id_receta_new = uuidv4();
    let ingredient = ingredientes;
    //Insertar una nueva receta
    if (id_receta == ''){
      //Crear la receta inicial con sus datos
     conn.query("INSERT INTO tbl_recetas (id_receta, nombre_receta, imagen, descripcion,cantidad_plato, activo, sub_receta, tipo_receta, id_restaurant ) VALUES(?,?,?,?,?,?,?,?,?)", [id_receta_new, nombre_receta,imagen,descripcion,cantidad_plato,1, isSubreceta, tipoPlato, id_restaurant], 
      (err, result) => {
        if (err){
           return res.status(500).json({message: err});
        }

        let arrnew = []

        for (var i in ingredient){
          let id_ingrediente = ingredient[i][0];
          let cantidad_ingrediente_plato = ingredient[i][1];
          let unidad_medida_r = ingredient[i][2];
          arrnew.push([uuidv4(), unidad_medida_r, cantidad_ingrediente_plato, 1, id_ingrediente, id_receta_new])
        }

        if (arrnew.length > 0){
          //Insertar todos los ingredientes que esta receta haya creado
          conn.query("INSERT INTO tbl_ingredientes_receta (id_ingrediente_receta, unidad_medida_r,  cantidad_por_receta, activo,   id_ingrediente, id_receta) VALUES ?",
          [arrnew], 
          (err, resultdata) => {
            if (err){
             return res.status(500).json({message: err});
            }
  
            //Insertar las referencias de la subReceta hacia las recetas padres en la tabla tbl_subRecetas
            let arrIdsSubReceta = []; 
            if (hasRecetaPadre == 1){
              let arrSubRecetas = [];
              for (var i in sub_receta){
                arrIdsSubReceta.push(sub_receta[i].value);
                arrSubRecetas.push([uuidv4(), sub_receta[i].value, id_receta_new, 1]);
              }
    
              if (arrSubRecetas.length > 0){
                conn.query("INSERT INTO tbl_sub_recetas (id_sub_receta,id_receta, cod_receta_padre, activo) VALUES ?",
                 [arrSubRecetas], (err, result) => {
                  if (err){
                    return res.status(500).json({message: err});
                  }

                  if (result.affectedRows > 0){                    
                    res.status(200).json({message: true, id_create: id_receta_new });
                  }else{
                    res.status(200).json({message: true, id_create: id_receta_new });
                  }
                 }
               )
              }       
            }else{
               res.status(200).json({message: true, id_create: id_receta_new });
            }
          });
        }
      });
      //aqui se empieza a editar las recetas
    }else{

      //Editar la receta general  
      conn.query("UPDATE tbl_recetas SET nombre_receta = ?, imagen = ?, descripcion = ?, cantidad_plato = ?, tipo_receta = ?, sub_receta = ? WHERE id_receta = ?",
        [nombre_receta, imagen, descripcion, cantidad_plato,tipoPlato,isSubreceta ,id_receta] ,
        (err, result) => {
          if (err){
            return res.status(500).json({message: err});
          }

          if (result.affectedRows != undefined && result.affectedRows > 0){
            let parseData = [];


            for (var i in sub_receta){
              parseData.push([uuidv4(), sub_receta[i].value, id_receta, 1]);
            }

            //eliminar la recetas para que no las vean
            //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°|
            conn.query('DELETE FROM tbl_sub_recetas WHERE cod_receta_padre = ?', [id_receta],
            (err, result) => {
              if (err){
                return res.status(500).json({message: err})
              }

              //insertar los nuevos registros si los tiene
              if (parseData.length > 0){
                if (result.protocol41 != undefined && result.protocol41 == true){
                  conn.query('INSERT INTO tbl_sub_recetas(id_sub_receta, id_receta, cod_receta_padre, activo) VALUES ?', [parseData],
                  (err, result) => {
                    if (err){
                      return res.status(500).json({message: err})
                    }

            //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°|
                  });
                }
              }

            //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°|°
            //ingredientes 
              conn.query('DELETE FROM tbl_ingredientes_receta WHERE id_receta = ?', [id_receta], 
              (err, result) => {
                if (err){
                  return res.status(500).json({message: err});
                }

                let mapIngredients = ingredient.map((row) => {
                  let rowFinal = [];
                  rowFinal[0] = uuidv4();
                  rowFinal[1] = row[0];
                  rowFinal[2] = row[1];
                  rowFinal[3] = row[2];
                  rowFinal[4] = id_receta;
                  rowFinal[5] = 1;
                  return rowFinal;
                });   


                conn.query("INSERT INTO tbl_ingredientes_receta(id_ingrediente_receta, id_ingrediente, cantidad_por_receta, unidad_medida_r, id_receta, activo) VALUES ?", [mapIngredients], 
                (err, result) => {
                  if (err){
                    return res.status(500).json({message: err})
                  }

                  if (result.affectedRows >= 0){
                    res.status(200).json({message: true});
                  }
                });
              });
            });
          }
        }
      );
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

          //Consulta de todos los ingredientes para guardarlos en result y entregar ingrediente por recetas
          conn.query('SELECT Ir.*, i.nombre_ingrediente  FROM tbl_ingredientes_receta AS Ir INNER JOIN tbl_ingredientes AS i ON Ir.id_ingrediente = i.id_ingrediente WHERE Ir.id_receta  IN ("'+parseData+'") && Ir.activo = 1;',
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

            //Consultas las sub_Recetas para todas las recetas
            conn.query('SELECT sub.*, rec.nombre_receta, rec.imagen, rec.tipo_receta FROM tbl_sub_recetas AS sub INNER JOIN tbl_recetas AS rec ON rec.id_receta =  sub.id_receta WHERE sub.id_receta IN ("'+parseData+'") && sub.activo = 1', 
            (err, resultSub) => {
              if (err){
                return res.status(500).json({message: err})
              }

              for (var i in result){
                let id_receta = result[i].id_receta;
                let arrLocal = [];
                for (var f in resultSub){
                  if (resultSub[f].cod_receta_padre == id_receta){
                    arrLocal.push(resultSub[f]);
                  }
                }
                result[i].sub_recetas = arrLocal;
              }

              
              res.status(200).json({ result });
            });
           });
        }else{
          res.status(200).json({ result });
        }
      }
    });
  } catch (error) {
      res.status(500).json({message: error});
  }
}; 


//obtengo una receta ya sea editada o creada
const getResipeEdit = (req, res) => {
  try {
    let {data} = req.body;
    let id = data.id;
    let id_respie = data.respie;
    conn.query("SELECT * FROM tbl_recetas  WHERE id_restaurant = ? &&  id_receta = ? && activo = 1 ", [id, id_respie], (err, result) => {
      if (err) {
        res.status(400).json({ message: err });
      }

      if (result.length > 0 || result.length == 0) {
        
        //Consulta de todos los ingredientes para guardarlos en result y entregar ingrediente por la receta ingresada
        conn.query('SELECT Ir.*, i.nombre_ingrediente  FROM tbl_ingredientes_receta AS Ir INNER JOIN tbl_ingredientes AS i ON Ir.id_ingrediente = i.id_ingrediente WHERE Ir.id_receta = ? && Ir.activo = 1;',[id_respie],
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

            //Consultas las sub_Recetas para la receta editada
            conn.query('SELECT sub.*, rec.nombre_receta FROM tbl_sub_recetas AS sub INNER JOIN tbl_recetas AS rec ON rec.id_receta =  sub.id_receta WHERE sub.cod_receta_padre = ?  && sub.activo = 1', [id_respie],
            (err, resultSub) => {
              if (err){
                return res.status(500).json({message: err})
              }

              for (var i in result){
                let id_receta = result[i].id_receta;
                let arrLocal = [];
                for (var f in resultSub){
                  if (resultSub[f].cod_receta_padre == id_receta){
                    arrLocal.push(resultSub[f]);
                  }
                }
                result[i].sub_recetas = arrLocal;
              }

              
              res.status(200).json({ response: result });
            });
           });
      }
    });
  } catch (error) {
    res.status(500).json({message: error})
  }

}

module.exports = {
  createEditResipe,
  getAllResipePerUser,
  getResipeEdit
};
