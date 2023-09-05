const pepsQueries = {
  insertEntrada:
    "INSERT INTO tbl_entrada (cantidad, costo, total, ingredient_id) VALUES (?, ?, ?, ?)",

  insertSaldo:
    "INSERT INTO tbl_saldo (cantidad, costo, total, activo, ingredient_id) VALUES (?, ?, ?, ?, ?)",

  getSaldos:
    "SELECT * FROM tbl_saldo WHERE activo = 1 AND ingredient_id = ? ORDER BY fecha_saldo ASC",

  insertSalida:
    "INSERT INTO tbl_salida (cantidad, costo, total, ingredient_id) VALUES (?, ?, ?, ?)",

  updateSaldo:
    "UPDATE tbl_saldo SET activo = 0 WHERE id_saldo = ? AND ingredient_id = ?",

  getEntradas:
    "SELECT * FROM tbl_entrada WHERE ingredient_id = ? ORDER BY fecha_entrada ASC",

  getSalidas:
    "SELECT * FROM tbl_salida WHERE ingredient_id = ? ORDER BY fecha_salida ASC",

  getSaldo:
    "SELECT * FROM tbl_saldo WHERE ingredient_id = ? ORDER BY fecha_saldo ASC",
};

module.exports = pepsQueries;
