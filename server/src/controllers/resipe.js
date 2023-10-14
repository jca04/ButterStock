const conn = require("../db/db");
const { v4: uuidv4 } = require("uuid");
const { convertion } = require("../utils/unitConversion");

const createEditResipe = async (req, res) => {
  try {
    let {id_receta , nombre_receta, descripcion, tipoPlato, cantidad_plato, ingredientes, sub_receta , id_restaurant, imagen, isSubreceta, infoReceta} = req.body.data.data;
    let id_receta_new = uuidv4();
    let ingredient = ingredientes;
    //Insertar una nueva receta
    if (id_receta == ''){
      //Crear la receta inicial con sus datos
      const insertRecipe = await conn.query('INSERT INTO tbl_recetas '+
      ' (id_receta, nombre_receta, imagen, descripcion,cantidad_plato, activo, sub_receta, tipo_receta, id_restaurant ) '+
      ' VALUES(?,?,?,?,?,?,?,?,?)', 
      [id_receta_new, nombre_receta, imagen, descripcion, cantidad_plato, 1, isSubreceta, tipoPlato, id_restaurant]);

      //Agregar los ingredientes a un array para hacer el insert una sola vez
      let arrnew = [];
      for (var i in ingredient) {
        const id_ingrediente = ingredient[i][0];
        const cantidad_ingrediente_plato = ingredient[i][1];
        const unidad_medida_r = ingredient[i][2];
        arrnew.push([uuidv4(), unidad_medida_r, cantidad_ingrediente_plato, 1, id_ingrediente, id_receta_new]);
      }

      if (arrnew.length > 0){
        const insertIngredientReceta = await conn.query('INSERT INTO tbl_ingredientes_receta '+
        ' (id_ingrediente_receta, unidad_medida_r,  cantidad_por_receta, activo, id_ingrediente, id_receta) VALUES ?',
        [arrnew]);
      } 

      //Insertar las referencias de la subReceta hacia las recetas padres en la tabla tbl_subRecetas
      let arrIdsSubReceta = [];
      let arrSubRecetas = [];
      for (var i in sub_receta) {
        arrIdsSubReceta.push(sub_receta[i].value);
        arrSubRecetas.push([uuidv4(), sub_receta[i].value, id_receta_new, 1]);
      }

      if (arrSubRecetas.length > 0){
        const insertSubRecetas = await conn.query('INSERT INTO tbl_sub_recetas (id_sub_receta,id_receta, cod_receta_padre, activo) VALUES ?',[arrSubRecetas]);
      }

      if (JSON.stringify(infoReceta) != '{}'){
        const info = infoReceta;
        const insertInfoRecipe = await conn.query('INSERT INTO tbl_inforeceta '+
        ' (id_inforeceta, margen_error, sub_total, sub_total_M_E, margen_contribucion, subTotal_margen_contribucion,costo_potencial_venta, iva,	costo_venta, id_receta) '+
        ' VALUES (?,?,?,?,?,?,?,?,?,?)',
        [uuidv4(), info.margen_error, info.subTotal, info.sub_total_M_E, info.margenContribucion, info.subTotal_margen_contribucion, info.costo_potencial_venta, info.iva, info.costo_venta_final, id_receta_new]);

        if (insertInfoRecipe.protocol41){
          res.status(200).json({message: true, id_create: id_receta_new });
        }
      }else{
        res.status(200).json({ message: true, id_create: id_receta_new });
      }

      //aqui se empieza a editar las recetas
    }else{
      //Editar la receta general  
      const updateRecipe = await conn.query('UPDATE tbl_recetas SET nombre_receta = ?, imagen = ?, descripcion = ?, cantidad_plato = ?, tipo_receta = ?, sub_receta = ? WHERE id_receta = ?',
      [nombre_receta, imagen, descripcion, cantidad_plato,tipoPlato,isSubreceta ,id_receta]);

      if (updateRecipe.affectedRows != undefined && updateRecipe.affectedRows > 0){
        let subRecetasInsert = [];
        for (let i in sub_receta){
          subRecetasInsert.push([uuidv4(), sub_receta[i].value, id_receta, 1]);
        }

        //eliminar las subRecetas 
        const deleteSubRecipe = await conn.query('DELETE FROM tbl_sub_recetas WHERE cod_receta_padre = ?', [id_receta]);

        if (deleteSubRecipe.protocol41){
          if (subRecetasInsert.length > 0){
            const insertSubRecipe = await conn.query('INSERT INTO tbl_sub_recetas(id_sub_receta, id_receta, cod_receta_padre, activo) VALUES ?',
            [subRecetasInsert]);
          }
        }

        //formatear los ingredientes que entra desdes el front
        let mapIngredients = ingredient.map((row) => {
          let rowFormated = [];
          rowFormated[0] = uuidv4();
          rowFormated[1] = row[0];
          rowFormated[2] = row[1];
          rowFormated[3] = row[2];
          rowFormated[4] = id_receta;
          rowFormated[5] = 1;

          return rowFormated;
        });

        //consultar los ingredientes que tenga esta receta
        const ingredientPerRecipe = await conn.query('SELECT  '+
        ' rc.id_ingrediente, rc.unidad_medida_r, rc.cantidad_por_receta, rc.activo, '+
        ' ing.unidad_medida AS unidadOriginal, cantidad_editable_ingrediente'+
        ' FROM tbl_ingredientes_receta AS rc '+
        ' INNER JOIN tbl_ingredientes AS ing'+
        ' ON rc.id_ingrediente = ing.id_ingrediente'+
        ' WHERE rc.id_receta = ?', [id_receta]);

        //validar que los ingredientes consultados esten en el map
        //sino, devolver el valor de cantidad al ingrediente
        //y eliminar el ingrediente relacionado con la receta

        let ingredientsNOIn = ingredientPerRecipe;
        for (let valid in ingredientsNOIn){
          const idIngrediente = ingredientsNOIn[valid].id_ingrediente;

          if (ingredientsNOIn[valid]['delete'] == undefined){
            for (let validMap in mapIngredients){
              const idIngredienteMap = mapIngredients[validMap][1];
              if (idIngredienteMap === idIngrediente){
                ingredientsNOIn[valid]['delete'] = false;                
              }
            }
          }else continue;
        }

        //Devolver el valor al ingrediente si el ingrediente es eliminado
        for (let i in ingredientsNOIn){
          if (ingredientsNOIn[i].delete === undefined){
            const ingredient = ingredientsNOIn[i].id_ingrediente
            //datos del ingrediente general
            const unityToDelete = ingredientsNOIn[i].unidadOriginal;
            const quantityToAdd = ingredientsNOIn[i].cantidad_editable_ingrediente;
            //datos del ingrediente relacionada con la receta
            const unityPresent = ingredientsNOIn[i].unidad_medida_r;
            const quantityPresent = ingredientsNOIn[i].cantidad_por_receta;

            const convertionValues =  convertion(unityPresent, quantityPresent, unityToDelete);
            const valueFinal = parseFloat(quantityToAdd + convertionValues);
            
            const updateIngredientOriginal = await conn.query('UPDATE tbl_ingredientes '+
            ' SET cantidad_editable_ingrediente = ? WHERE id_ingrediente = ?',
            [valueFinal, ingredient]);

          }
        }
        

        //editar los ingredientes
        const deleteIngredients = await conn.query('DELETE FROM tbl_ingredientes_receta WHERE id_receta = ?',[id_receta]);
        if (deleteIngredients.protocol41){
          //insertar los nuevos ingredients
          const insertIngredients = await conn.query('INSERT INTO '+
          ' tbl_ingredientes_receta(id_ingrediente_receta, id_ingrediente, cantidad_por_receta, unidad_medida_r, id_receta, activo) '+ 
          ' VALUES ?',
          [mapIngredients]);
        }
        
        if (JSON.stringify(infoReceta) != '{}'){
          const info = infoReceta;

          const updateInfoRecipe = await conn.query('UPDATE '+
          ' tbl_inforeceta SET margen_error = ?, sub_total = ?, ' +
          ' sub_total_M_E = ?,  margen_contribucion = ?, '+
          ' subTotal_margen_contribucion = ?, costo_potencial_venta = ? , '+
          ' iva = ?, costo_venta = ? WHERE id_receta = ? ',
          [info.margen_error, info.subTotal, info.sub_total_M_E, info.margenContribucion, info.subTotal_margen_contribucion, info.costo_potencial_venta, info.iva, info.costo_venta_final, id_receta]);

          if (updateInfoRecipe.affectedRows != undefined){
            res.status(200).json({message: true});
          }else{
            res.status(200).json({message: true});
          }
        }else{
          res.status(200).json({message: true});
        }
      }
    }
  } catch (error) {
    res.status(500).json({message: error})
  }
};

const getAllResipePerUser =  (req, res) => {
  try {
    let { data } = req.body;
    let id = data.id;
    conn.query(
      "SELECT r.*, inf.margen_error, inf.sub_total, inf.sub_total_M_E, inf.margen_contribucion, inf.subTotal_margen_contribucion ,inf.costo_potencial_venta, inf.iva, inf.costo_venta FROM tbl_recetas AS r LEFT JOIN tbl_inforeceta AS inf ON r.id_receta = inf.id_receta WHERE r.id_restaurant = ? && r.activo = 1 ORDER BY r.time_stamp DESC;",
      [id],
      (err, result) => {
        if (err) {
          res.status(400).json({ message: err });
        }

        if (result.length > 0 || result.length == 0) {
          let arrConcat = [];
          for (var i in result) {
            arrConcat.push(result[i].id_receta);
          }

          if (arrConcat.length > 0) {
            let parseData = "" + arrConcat.join('","') + "";

            //Consulta de todos los ingredientes para guardarlos en result y entregar ingrediente por recetas
            conn.query(
              'SELECT Ir.*, i.nombre_ingrediente, i.unidad_medida AS unidad_original  FROM tbl_ingredientes_receta AS Ir INNER JOIN tbl_ingredientes AS i ON Ir.id_ingrediente = i.id_ingrediente WHERE Ir.id_receta  IN ("' +
                parseData +
                '") && Ir.activo = 1;',

              (err, resultIn) => {
                if (err) {
                  res.status(400).json({ message: err });
                }

                if (Array.isArray(resultIn)) {
                  //comparar datos para entregar con sus respectivos ingredientes
                  for (var i in result) {
                    let id_receta = result[i].id_receta;
                    let arrLocal = [];
                    for (var f in resultIn) {
                      if (resultIn[f].id_receta == id_receta) {
                        arrLocal.push(resultIn[f]);
                      }
                    }
                    // console.log(arrLocal)
                    result[i].ingredientes = arrLocal;
                  }
                }

                //Consultas las sub_Recetas para todas las recetas
                conn.query(
                  'SELECT sub.*, rec.nombre_receta FROM tbl_sub_recetas AS sub INNER JOIN tbl_recetas AS rec ON rec.id_receta =  sub.id_receta WHERE sub.id_receta IN ("' +
                    parseData +
                    '") && sub.activo = 1',
                  (err, resultSub) => {
                    if (err) {
                      return res.status(500).json({ message: err });
                    }

                    for (var i in result) {
                      let id_receta = result[i].id_receta;
                      let arrLocal = [];
                      for (var f in resultSub) {
                        if (resultSub[f].cod_receta_padre == id_receta) {
                          arrLocal.push(resultSub[f]);
                        }
                      }
                      result[i].sub_recetas = arrLocal;
                    }

                    res.status(200).json({ result });
                  }
                );
              }
            );
          } else {
            res.status(200).json({ result });
          }
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: error });
  }
};


//obtengo una receta ya sea editada o creada
const getResipeEdit = async (req, res) => {
  try {
    let {data} = req.body;
    let id = data.id;
    let id_respie = data.respie;
    
    conn.query("SELECT r.*, inf.margen_error, inf.sub_total, inf.sub_total_M_E, inf.margen_contribucion, inf.subTotal_margen_contribucion ,inf.costo_potencial_venta, inf.iva, inf.costo_venta FROM tbl_recetas AS r LEFT JOIN tbl_inforeceta AS inf ON r.id_receta = inf.id_receta WHERE r.id_restaurant = ? &&  r.id_receta = ? && r.activo = 1 ", [id, id_respie], (err, result) => {
      if (err) {
        res.status(400).json({ message: err });
      }

      if (result.length > 0 || result.length == 0) {
        //Consulta de todos los ingredientes para guardarlos en result y entregar ingrediente por la receta ingresada
        conn.query('SELECT Ir.*, i.nombre_ingrediente, i.unidad_medida AS unidad_original  FROM tbl_ingredientes_receta AS Ir INNER JOIN tbl_ingredientes AS i ON Ir.id_ingrediente = i.id_ingrediente WHERE Ir.id_receta = ? && Ir.activo = 1;',[id_respie],
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

              
              res.status(200).json({ message: result });
            });
           });
      }
    });
  } catch (error) {
    res.status(500).json({message: error})
  }

}

//editar la cantidad de los ingredientes
const editQuantity = async (req, res) => {

  try {
    let {data} = req.body; 
    let ingredients = data.ingredient;
    let id_restaurant = data.id;

    if (ingredients.length > 0){
      if (ingredients[0] !== null && ingredients[0] != NaN){
        conn.query('UPDATE tbl_ingredientes SET cantidad_editable_ingrediente = ? WHERE id_restaurant = ? && id_ingrediente = ?', [ingredients[0], id_restaurant ,ingredients[1]], 
        (err, result) => {
          if (err){
            return res.status(500).json({message: err});
          }

          if (result.protocol41){
             res.status(200).json({message: 'ok'});
          }else res.status(500).json({message:'erro'});
        });
      }else{
        res.status(200).json({message: 'ok'});
      }
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  createEditResipe,
  getAllResipePerUser,
  getResipeEdit,
  editQuantity,
};
