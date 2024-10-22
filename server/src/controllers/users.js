const conn = require("../db/db");
const { v4: uuidv4 } = require("uuid");
const { encrypt, verified } = require("../utils/bcrypt.handle");
const { generateToken } = require("../utils/jwt.handle");
const { sendMailErrorToDevelopment } = require("./mail");

const getUsers = async (req, res) => {
  try {
    conn.query("SELECT * FROM all_users", (err, result) => {
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
    const { nombre, contraseña, apellido, correo, idRestaurant } = req.body;
    const id = uuidv4();
    const passHash = await encrypt(contraseña);
    conn.query(
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
              "INSERT INTO tbl_users (id_users, nombre, contraseña, apellido, correo, id_restaurant, admin, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
              [id, nombre, passHash, apellido, correo, idRestaurant, 1, 1]
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
    conn.query(
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
              let data = {
                token,
              };
              //   res
              //     .cookie("token", token, {
              //       httpOnly: true,
              //       secure: true,
              //     })
              //     .json({ message: "Login successful" });
              res.status(200).send(data);
            } else {
              res.status(200).json({
                error: "Contraseña incorrecta",
              });
            }
          } else {
            res
              .status(200)
              .json({ error: "El usuario no existe y/o esta desactivado" });
          }
        }
      }
    );
  } catch (error) {
    sendMailErrorToDevelopment(error)
    res.status(500).json({ error });
  }
};

//obtener solo un usuario
const getUser = async (req, res) => {
  try {
    let { id } = req.user;
    conn.query(
      "SELECT nombre, apellido, correo, admin, superAdmin, activo,  id_restaurant  FROM tbl_users WHERE id_users = ? && activo = 1",
      [id],
      async (err, result) => {
        if (err) {
          res.status(400).json({ message: err });
        } else {
          if (result.length > 0) {
            let dataRes = result[0];
            res.status(200).json(dataRes);
          } else {
            res.status(400).json({
              message: "El usuario no existe y/o no esta activo",
            });
          }
        }
      }
    );
  } catch (error) {
    res.status(400).json({ message: error });
  }
};


const getUsersPerRestaurant = async (req, res) => {
  try {
    const { data } = req.body;
    const id = data.id;
    const getUser = await conn.query('SELECT nombre, apellido, correo FROM tbl_users WHERE id_restaurant = ?', [id]);
    res.status(200).json({message: getUser});
  } catch (error) {
      res.status(500).json({message: error});
  }
}

module.exports = {
  getUsers,
  registerUser,
  loginUser,
  getUser,
  getUsersPerRestaurant
};
