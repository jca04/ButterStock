const conn = require("../db/db");

/**
 *
 * @param {*} sql  query a ejecutar
 * @param {*} values  valores a insertar en la query
 * @returns  resultado de la query
 */

function queryAsync(sql, values) {
  return new Promise((resolve, reject) => {
    conn.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = { queryAsync };
