const conn = require("../db/db");
const { v4: uuidv4 } = require("uuid");
const { encrypt, verified } = require("../utils/bcrypt.handle");
const { generateToken } = require("../utils/jwt.handle");
uuidv4(); // sadasd
const getUsers = (req, res) => {
  try {
    console.log(req.user);
    conn.query(
      "SELECT * FROM tbl_users WHERE id_users = ?",
      [req.user.id],
      (err, result) => {
        if (err) {
          res.status(400).json({ error: err });
        } else {
          res.status(200).json({ result });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const registerUser = async (req, res) => {
  try {
    const { nombre, contraseña, apellido, correo } = req.body;
    const id = uuidv4();
    const passHash = await encrypt(contraseña);
    await conn.query(
      "SELECT nombre, apellido, correo FROM tbl_users WHERE correo = ?",
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
              [id, nombre, passHash, apellido, correo, "123213"]
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

const loginUser = async (req, res) => {
  try {
    const { contraseña, correo } = req.body;
    await conn.query(
      "SELECT id_users, nombre, apellido, correo, contraseña FROM tbl_users WHERE correo = ?",
      [correo],
      async (err, result) => {
        if (err) {
          res.status(200).json({ error: err });
        } else {
          if (result.length > 0) {
            const verifiedPass = await verified(
              contraseña,
              result[0].contraseña
            );

            if (verifiedPass) {
              const token = generateToken(result[0].id_users);
              const data = {
                nombre: result[0].nombre,
                apellido: result[0].apellido,
                correo: result[0].correo,
                token,
              };
              res.status(200).json(data);
            } else {
              res.status(200).json({ error: "Contraseña incorrecta" });
            }
          } else {
            res.status(200).json({ error: "El usuario no existe" });
          }
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = {
  getUsers,
  registerUser,
  loginUser,
};
