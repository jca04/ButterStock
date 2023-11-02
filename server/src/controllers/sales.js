const conn = require("../db/db");
const { v4: uuidv4 } = require("uuid");

const saveSales = async (req, res) => {
  try {
    const { data } = req.body;
    const { info } = data;
    const ingredientsResponse = [];

    for (const i in info){
      const uid = uuidv4();
      const id = i;
      const dataInfo = info[i];

      //Recetas y adiciones
      if (dataInfo['cantidad'] != undefined &&  dataInfo['unidad'] == undefined){
        //consultar el costo de venta de esta receta
        const quantity_recipe = parseInt(dataInfo['cantidad']);
         //guardar_venta
        const insert_recipe = await conn.query('INSERT INTO '+
       ' tbl_ventas(id_ventas, cantidad_venta, tipo_venta, id_receta) '+
       ' VALUES(?,?,?,?)', [uid, quantity_recipe, 'receta', id]);

        if (insert_recipe.affectedRows > 0){
          //encontrar los ingredientes de esta receta o adicion
          const ingredients = await conn.query('SELECT'+
          ' ingR.unidad_medida_r, ingR.cantidad_por_receta, ingR.id_ingrediente, ingR.id_receta, ing.kardex FROM tbl_ingredientes_receta AS ingR'+
          ' INNER JOIN tbl_ingredientes AS ing ON'+
          ' ing.id_ingrediente = ingR.id_ingrediente'+
          ' WHERE ingR.activo = 1 && ingR.id_receta = ?', [id]);

          if (ingredients.length > 0){
            for (const ing in ingredients){
              ingredientsResponse.push({
                unidad_medida: ingredients[ing]['unidad_medida_r'],
                cantidad: ingredients[ing]['cantidad_por_receta'],
                id_ingrediente: ingredients[ing]['id_ingrediente'],
                kardex: ingredients[ing]['kardex'],
                cantidad_receta: quantity_recipe
              });
            }
          }
        }
      }else{
        //cuando son ingredientes lo que se envian
        if (dataInfo['cantidad'] != undefined && dataInfo['unidad'] != undefined){
          const quantity_ingredient = parseFloat(dataInfo['cantidad']);
          const unity = dataInfo['unidad'];

          //gaurdar el ingrediente en tbl_ventas
          const insert_ingredients = await conn.query('INSERT INTO '+
          ' tbl_ventas(id_ventas, cantidad_venta, tipo_venta, unidad_medida_venta, id_ingrediente) '+
          ' VALUES(?,?,?,?,?)', [uid, quantity_ingredient, 'ingrediente', unity, id]);

          if (insert_ingredients.affectedRows > 0){
            const selectIngredient = await conn.query('SELECT kardex FROM tbl_ingredientes WHERE id_ingrediente = ?',[id]);
            const kardexIngredient = selectIngredient[0].kardex; 

            ingredientsResponse.push({
              unidad_medida: unity,
              cantidad: quantity_ingredient,
              id_ingrediente: id,
              kardex: kardexIngredient
            });
          }
        }
      }
    }

    res.status(200).json({message: ingredientsResponse});
  } catch (error) {
    res.status(500).json({message: error});
  }
}


module.exports = {
  saveSales
}