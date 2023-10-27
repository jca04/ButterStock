//funcion que actualizara todos los valores de una receta
//de acuerdo al ingrediente que se esta editando o se esta eliminado
//data envidad por ingrediente en el front o el back-end
const conn = require("../db/db");
const {convertion} = require("../utils/unitConversion");

const refreshResipes = async (id_ingrediente, typeRequest) => {
  try {
    if (typeRequest == 'delete'){
      const response = await refreshIngredient(id_ingrediente);
      if (response.message != 'OK'){
        return false;
      }
    }

    const result = await conn.query('SELECT rc.cantidad_plato AS receta_cantidad_plato, inf.*  ' +
    ' FROM tbl_ingredientes_receta AS ig '+
    ' INNER JOIN tbl_recetas AS rc ON ig.id_receta = rc.id_receta' +
    ' INNER JOIN tbl_inforeceta AS inf ON inf.id_receta = rc.id_receta' +
    ' WHERE id_ingrediente = ? ', [id_ingrediente])


    const recetas = result;

    if (recetas.length > 0){
      recetas.forEach(async (element) =>  {
        const id_receta = element.id_receta;
        let sumatIngredientValue = 0;

        const ingredient = await conn.query('SELECT ir.cantidad_por_receta AS select_cantidad_receta, ir.unidad_medida_r AS select_unidad, '+
        ' irng.unidad_medida, irng.costo_unitario, irng.cantidad_editable_ingrediente, irng.refresh, irng.id_ingrediente '+
        ' FROM tbl_ingredientes_receta AS ir ' +
        ' INNER JOIN tbl_ingredientes AS irng ON'+
        ' ir.id_ingrediente = irng.id_ingrediente WHERE ir.id_receta = ? && ir.activo = 1' 
        , [id_receta]);

        for (let i in ingredient){
          const cantida_receta_select = ingredient[i].select_cantidad_receta;
          const unidad_medida_r_select = ingredient[i].select_unidad;
          const unidad_medidad_original = ingredient[i].unidad_medida;
          const costo_unitario = ingredient[i].costo_unitario;

          const convertionValues = convertion(unidad_medida_r_select, cantida_receta_select, unidad_medidad_original);
          const valorIngredient = convertionValues * costo_unitario;
          sumatIngredientValue = sumatIngredientValue + valorIngredient;
        }

        const cantidad_plato = element.receta_cantidad_plato
        const margen_error = element.margen_error;
        const margen_contribucion = element.margen_contribucion;
        const iva = element.iva;

        const subTotal_margen_error = sumatIngredientValue + (sumatIngredientValue * margen_error);
        const subTotal_margen_contribucion =  subTotal_margen_error  + ( subTotal_margen_error * margen_contribucion);
        const costo_potencial_venta = (subTotal_margen_contribucion + subTotal_margen_error) / cantidad_plato;
        const costo_venta = costo_potencial_venta + (costo_potencial_venta * iva);


        //consultar las sub_recetas para adicionarlas al costo_venta
        const sub_recetas = await conn.query('SELECT inf.costo_venta FROM tbl_sub_recetas AS sub '+ 
        ' INNER JOIN tbl_inforeceta AS inf '+
        ' ON sub.id_receta = inf.id_receta '+
        ' WHERE sub.cod_receta_padre = ?'
        ,[id_receta]);

        let sumatoria_sub_recetas = 0;
        for (let i in sub_recetas){
          if (sub_recetas[i].costo_venta != undefined){
            sumatoria_sub_recetas = sumatoria_sub_recetas + sub_recetas[i].costo_venta;
          }
        }

        let costo_venta_final = costo_venta + sumatoria_sub_recetas;
            
        const updateInfoReceta = await conn.query('UPDATE tbl_inforeceta SET '+
        ' sub_total = ?, sub_total_M_E = ?, '+
        ' subTotal_margen_contribucion = ?, costo_potencial_venta = ?, costo_venta = ? '+
        ' WHERE id_receta = ?'
        ,[sumatIngredientValue, subTotal_margen_error, subTotal_margen_contribucion, costo_potencial_venta, costo_venta_final, id_receta]);

        });
      }

      return {message: 'OK'};

    } catch (error) {
      return {message: error}
    }
}


const refreshIngredient = async (id_ingrediente) => {
  try {
    const deleteIngredient = await conn.query('UPDATE tbl_ingredientes '+
    ' SET activo = 0, refresh = 1 WHERE id_ingrediente = ?',[id_ingrediente]);

    if (deleteIngredient.affectedRows > 0){
      const comeBackValueIngredient = await conn.query('SELECT inr.cantidad_por_receta, inr.unidad_medida_r, ing.* '+
      ' FROM tbl_ingredientes_receta AS inr ' +
      ' INNER JOIN tbl_ingredientes AS ing ' +
      ' ON ing.id_ingrediente = inr.id_ingrediente' +
      ' WHERE inr.id_ingrediente = ?',[id_ingrediente]);

      if (Array.isArray(comeBackValueIngredient)){
        let sumatoriaCantidad = 0;
        let cantidad_editable = 0;
        for (let i in comeBackValueIngredient){
          const unidad_medida_original = comeBackValueIngredient[i].unidad_medida;
          const cantidad_editable_ingrediente = comeBackValueIngredient[i].cantidad_editable_ingrediente;
          //vairable tbl_ingrediente_receta
          const cantidad_por_receta = comeBackValueIngredient[i].cantidad_por_receta;
          const unidad_medida_r =comeBackValueIngredient[i].unidad_medida_r;

          const valorConversion = convertion(unidad_medida_r, cantidad_por_receta, unidad_medida_original);
          sumatoriaCantidad = sumatoriaCantidad + valorConversion;
          cantidad_editable = cantidad_editable_ingrediente;
        }
        let cantida_editar = sumatoriaCantidad + cantidad_editable;

        const uptadeCantidadEditable = await conn.query('UPDATE tbl_ingredientes '+
        ' SET cantidad_editable_ingrediente = ? '+
        ' WHERE id_ingrediente = ?', [cantida_editar, id_ingrediente]);

        if (uptadeCantidadEditable.affectedRows > 0){
          const updateIngredientSQL = await conn.query('UPDATE tbl_ingredientes_receta '+
          ' SET activo = 0 WHERE id_ingrediente = ?', [id_ingrediente]);

          if (updateIngredientSQL.affectedRows > 0){
            return {message: 'OK'}
          }else{
            return {message: 'OK'}
          }
        }
      }else{
        return {message: 'something failed'};
      }
    }
  } catch (error) {
    return {message: 'something failed'};
  }
}

module.exports = {
  refreshResipes
}