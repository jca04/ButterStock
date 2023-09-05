const conn = require("../db/db");
const { v4: uuidv4 } = require("uuid");

const createEditResipe = async (req, res) => {
  try {
    let {
      id_receta,
      nombre_receta,
      descripcion,
      tipoPlato,
      cantidad_plato,
      ingredient,
      sub_receta,
      id_restaurant,
      imagen,
    } = req.body.data.data;
    let id_receta_new = uuidv4();
    //Insertar una nueva receta
    if (id_receta == "") {
      let hasRecetaPadre = 0;
      if (sub_receta.length > 0) {
        hasRecetaPadre = 1;
      }

      //Crear la receta inicial con sus datos
      conn.query(
        "INSERT INTO tbl_recetas (id_receta, nombre_receta, imagen, descripcion,cantidad_plato, activo, sub_receta, tipo_receta, id_restaurant ) VALUES(?,?,?,?,?,?,?,?,?)",
        [
          id_receta_new,
          nombre_receta,
          imagen,
          descripcion,
          cantidad_plato,
          1,
          0,
          tipoPlato,
          id_restaurant,
        ],
        (err, result) => {
          if (err) {
            return res.status(500).json({ message: err });
          }
          return true;
        }
      );

      let arrnew = [];

      for (var i in ingredient) {
        let id_ingrediente = ingredient[i][0];
        let cantidad_ingrediente_plato = ingredient[i][1];
        let unidad_medida_r = ingredient[i][2];
        arrnew.push([
          uuidv4(),
          unidad_medida_r,
          cantidad_ingrediente_plato,
          1,
          id_ingrediente,
          id_receta_new,
        ]);
      }

      if (arrnew.length > 0) {
        //Insertar todos los ingredientes que esta receta haya creado
        conn.query(
          "INSERT INTO tbl_ingredientes_receta (id_ingrediente_receta, unidad_medida_r,  cantidad_por_receta, activo,   id_ingrediente, id_receta) VALUES ?",
          [arrnew],
          (err, resultdata) => {
            if (err) {
              return res.status(500).json({ message: err });
            }

            //Insertar las referencias de la subReceta hacia las recetas padres en la tabla tbl_subRecetas
            let arrIdsSubReceta = [];
            if (hasRecetaPadre == 1) {
              let arrSubRecetas = [];
              for (var i in sub_receta) {
                arrIdsSubReceta.push(sub_receta[i].value);
                arrSubRecetas.push([
                  uuidv4(),
                  sub_receta[i].value,
                  id_receta_new,
                  1,
                ]);
              }

              if (arrSubRecetas.length > 0) {
                conn.query(
                  "INSERT INTO tbl_sub_recetas (id_sub_receta,id_receta, cod_receta_padre, activo) VALUES ?",
                  [arrSubRecetas],
                  (err, result) => {
                    if (err) {
                      return res.status(500).json({ message: err });
                    }

                    if (result.affectedRows > 0) {
                      //Editar el valos sub_receta en las recetas que se seleccionaron para asi volverlas subRecetas
                      if (arrSubRecetas.length > 0) {
                        let concatIdSub = "" + arrIdsSubReceta.join('","') + "";

                        conn.query(
                          'UPDATE tbl_recetas SET sub_receta = 1 WHERE id_receta IN ("' +
                            concatIdSub +
                            '")',
                          (err, result) => {
                            if (err) {
                              return res.status(500).json({ message: err });
                            }

                            if (
                              result.affectedRows != undefined &&
                              result.affectedRows > 0
                            ) {
                              res.status(200).json({ message: true });
                            }
                          }
                        );
                      } else {
                        res.status(200).json({ message: true });
                      }
                    } else {
                      res.status(200).json({ message: true });
                    }
                  }
                );
              }
            } else {
              res.status(200).json({ message: true });
            }
          }
        );
      }
    }

    //aqui se empieza a editar las recetas
    else {
      //Editar la receta general
      conn.query(
        "UPDATE tbl_recetas SET nombre_receta = ?, imagen = ?, descripcion = ?, cantidad_plato = ? WHERE id_receta = ?",
        [nombre_receta, imagen, descripcion, cantidad_plato, id_receta],
        (err, result) => {
          if (err) {
            return res.status(500).json({ message: err });
          }

          if (result.affectedRows != undefined && result.affectedRows > 0) {
            let parseData = [];

            for (var i in sub_receta) {
              parseData.push([uuidv4(), sub_receta[i].value, id_receta, 1]);
            }

            //eliminar la recetas para que no las vean
            //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°|
            conn.query(
              "DELETE FROM tbl_sub_recetas WHERE cod_receta_padre = ?",
              [id_receta],
              (err, result) => {
                if (err) {
                  return res.status(500).json({ message: err });
                }

                //insertar los nuevos registros si los tiene
                if (sub_receta.length > 0) {
                  if (
                    result.affectedRows != undefined &&
                    result.affectedRows > 0
                  ) {
                    conn.query(
                      "INSERT INTO tbl_sub_recetas(id_sub_receta, id_receta, cod_receta_padre, activo) VALUES ?",
                      [parseData],
                      (err, result) => {
                        if (err) {
                          return res.status(500).json({ message: err });
                        }
                        //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°|
                      }
                    );
                  }
                }

                //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°|°
                //ingredientes
                conn.query(
                  "DELETE FROM tbl_ingredientes_receta WHERE id_receta = ?",
                  [id_receta],
                  (err, result) => {
                    if (err) {
                      return res.status(500).json({ message: err });
                    }

                    let mapIngredients = ingredient.map((row) => {
                      row.splice(3, 1);
                      row[4] = id_receta;
                      row.unshift(uuidv4());
                      return row;
                    });

                    conn.query(
                      "INSERT INTO tbl_ingredientes_receta(id_ingrediente_receta, id_ingrediente, cantidad_por_receta, unidad_medida_r, id_receta) VALUES ?",
                      [mapIngredients],
                      (err, result) => {
                        console.log(err, result);
                      }
                    );
                    console.log(mapIngredients);
                  }
                );
              }
            );
          }
        }
      );
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const getAllResipePerUser = (req, res) => {
  try {
    let { data } = req.body;
    let id = data.id;
    conn.query(
      "SELECT * FROM tbl_recetas  WHERE id_restaurant = ? && activo = 1 ORDER BY tbl_recetas.time_stamp DESC",
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
              'SELECT Ir.*, i.nombre_ingrediente  FROM tbl_ingredientes_receta AS Ir INNER JOIN tbl_ingredientes AS i ON Ir.id_ingrediente = i.id_ingrediente WHERE Ir.id_receta  IN ("' +
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

const getResipeLimit = (req, res) => {
  try {
    let { data } = req.body;
    let id_restaurant = data.data;

    conn.query(
      "SELECT * FROM tbl_recetas  WHERE id_restaurant = ? && activo = 1 ORDER BY tbl_recetas.time_stamp DESC LIMIT 1",
      [id_restaurant],
      (err, result) => {
        if (err) {
          res.status(500).json({ message: err });
        }

        if (result.length > 0) {
          res.status(200).json({ response: result });
        } else {
          res.status(200).json({ response: result });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = {
  createEditResipe,
  getAllResipePerUser,
  getResipeLimit,
};
