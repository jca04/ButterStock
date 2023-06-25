const conn = require("../db/db");
const { v4: uuidv4 } = require("uuid");

const verifiedRestaurant = async (req, res) => {
    let name = req.body.name;

    try {
        if (name) {
            await conn.query(
                "SELECT id_restaurant FROM tbl_restaurant WHERE nombre = ?",
                [name],
                (err, result) => {
                    if (err) {
                        res.status(500).json({ messgae: "error" });
                    }

                    if (result.length > 0) {
                        res.status(200).json({
                            messgae: "restaurant exist yet",
                        });
                    } else {
                        res.status(200).json({
                            messgae: "restaurant doesn´t exist",
                        });
                    }
                }
            );
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};

const create = async (req, res) => {
    let file = "";
    let uuid = uuidv4();
    let { restaurant, ciudad, direccion } = req.body;
    if (req.file === undefined) {
        file = "";
    } else file = req.file.filename;

    try {
        await conn.query(
            "INSERT INTO tbl_restaurant (id_restaurant, nombre, ciudad, direccion,  pais, icono, activo) VALUES (?,?,?,?,?,?,?)",
            [uuid, restaurant, ciudad, direccion, "Colombia", file, 1],
            (err, result) => {
                if (err) {
                    res.status(200).json({ error: err });
                } else {
                    res.status(200).json({ messgae: uuid });
                }
            }
        );
    } catch (err) {
        res.status(500).json({ err });
    }
};

const getRestaurants = (req, res) => {
    try {
        conn.query(
            "SELECT * FROM tbl_users WHERE id_users = ?",
            [req.user.id],
            (err, result) => {
                if (err) {
                    res.status(200).json({ error: err });
                } else {
                    if (!result[0].length) {
                        res.status(200).json({ error: "El usuario no existe" });
                    } else {
                        if (result[0].activo == 0) {
                            res.status(200).json({
                                error: "El usuario no esta activo",
                            });
                        } else {
                            if (result[0].superAdmin == 1) {
                                conn.query(
                                    "SELECT * FROM tbl_restaurant",
                                    (err, result) => {
                                        if (err) {
                                            res.status(200).json({
                                                error: err,
                                            });
                                        } else {
                                            res.status(200).json({ result });
                                        }
                                    }
                                );
                            } else {
                                res.status(200).json({
                                    error: "No tienes permisos para ver los restaurantes",
                                });
                            }
                        }
                    }
                }
            }
        );
    } catch (error) {
        res.status(400).json({ error });
    }
};

module.exports = {
    create,
    verifiedRestaurant,
    getRestaurants,
};
