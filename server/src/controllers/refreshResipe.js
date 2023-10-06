//funcion que actualizara todos los valores de una receta
//de acuerdo al ingrediente que se esta editando o se esta eliminado
//data envidad por ingrediente en el front o el back-end
const conn = require("../db/db");

const refreshResipes = async (id_ingrediente) => {
  const dataRespie = await conn.query('SELECT rc.cantidad_plato AS receta_cantidad_plato, inf.*  ' +
  ' FROM tbl_ingredientes_receta AS ig '+
  ' INNER JOIN tbl_recetas AS rc ON ig.id_receta = rc.id_receta' +
  ' INNER JOIN tbl_inforeceta AS inf ON inf.id_receta = rc.id_receta' +
  ' WHERE id_ingrediente = ? ', [id_ingrediente],
  (err, result) => {
    if (err){
      return err
    }

    try {
      const recetas = result;

      if (recetas.length > 0){
        recetas.forEach(async (element) =>  {
          const id_receta = element.id_receta;
          await conn.query('SELECT ir.cantidad_por_receta AS select_cantidad_receta, ir.unidad_medida_r AS select_unidad, '+
          ' irng.unidad_medida, irng.costo_unitario, irng.cantidad_editable_ingrediente, irng.refresh '+
          ' FROM tbl_ingredientes_receta AS ir ' +
          ' INNER JOIN tbl_ingredientes AS irng ON'+
          ' ir.id_ingrediente = irng.id_ingrediente WHERE ir.id_receta = ? && ir.activo = 1' 
          , [id_receta],
            (err, result) => {
              if (err){
                console.log(err)
              }
              try {
                console.log(result)
                for (let i in result){
                  
                }
              } catch (error) {
             }
          });
        });

      }


    } catch (error) {
      return error
    }

  })

}

module.exports = {
  refreshResipes
}