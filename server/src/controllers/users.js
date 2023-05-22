const conn = require("../db/db");
const { v4: uuidv4 } = require("uuid");
const { encrypt } = require("../utils/bcrypt.handle");
uuidv4(); // sadasd

const getUsers = (req, res) => {
  try {
    conn.query("SELECT * FROM tbl_users", (err, result) => {
      if (err) {
        res.status(400).json({ error: err });
      } else {
        res.status(200).json({ result });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const registerUser = async (req, res) => {
  try {
    const { nombre, contraseña, apellido, correo } = req.body;
    const id = uuidv4();
    const passHash = await encrypt(contraseña);
    conn.query(
      "SELECT * FROM tbl_users WHERE correo = ?",
      [correo],
      (err, result) => {
        if (err) {
          res.status(400).json({ error: err });
        } else {
          if (result.length > 0) {
            res.status(400).json({ error: "User already exists" });
          } else {
            conn.query(
              "INSERT INTO tbl_users (id_users, nombre, contraseña, apellido, correo, id_restaurant) VALUES (?, ?, ?, ?, ?, ?)",
              [id, nombre, passHash, apellido, correo, "monda"]
            );
            res.status(200).json({ nombre });
          }
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports = {
  getUsers,
  registerUser,
};
