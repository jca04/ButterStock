const conn = require("../db/db");
const { v4: uuidv4 } = require("uuid");

const getDataSalidas = async (req, res) => {
  try {
    const { data }= req.body;
    const restaurant = data.restaurant;

    const getRecipes = await conn.query('SELECT id_receta, nombre_receta, cantidad_plato, tipo_receta, sub_receta '+
    ' FROM tbl_recetas WHERE id_restaurant = ? && activo = 1',
    [restaurant]);

    const getIngredients = await conn.query('SELECT id_ingrediente, nombre_ingrediente, unidad_medida, kardex, cantidad_total_ingrediente AS cantidad_max FROM tbl_ingredientes '+
    ' WHERE id_restaurant = ? && activo = 1',
    [restaurant]);
    
    const dataResponse = getRecipes.concat(getIngredients)

    const dataOutput = dataResponse.map((row) => {
      if (row.id_receta != undefined){
        if (row.sub_receta == 1){
          row['label'] = row.nombre_receta + ' | ' + 'Adicion';
        }else{
          row['label'] = row.nombre_receta + ' | ' + 'Receta';
        }

        row['value'] = row.id_receta;

      }else if (row.id_ingrediente != undefined){
        row['label'] = row.nombre_ingrediente + ' | ' + 'Ingrediente';
        row['value'] = row.id_ingrediente;
      }
      return row;
    });
   
    res.status(200).json({message: dataOutput});
  } catch (error) {
    res.status(500).json({message: error});
  }
}

module.exports = {  
  getDataSalidas
}