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

const getRestaurants = async (req, res) => {
    try {
        await conn.query("SELECT * FROM all_restaurants", (err, result) => {
            if (err) {
                res.status(400).json({ error: err });
            } else {
                res.status(200).json({ result });
            }
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

const toggleRestaurant = async (req, res) => {
    try {
        let {data} = req.body;
        if (data.resId){
            let idRestaurant = data.resId;
            let value = data.value;

            await conn.query("UPDATE tbl_restaurant SET activo = ? WHERE id_restaurant = ?", [value, idRestaurant], 
                (err, result) => {
                    if (err){
                        res.status(400).json({error: err})
                    }else{
                        let response = result.changedRows;
                        if (response == 1){
                            res.status(200).json({message: true})
                        }
                    }
                }
            );
        }
    } catch (error) {
        res.status(500).json({error})
    }
} 

const getRestaurant = async (req, res) => {
    try {
        let id_user = req.user.id;
        conn.query("SELECT tbl_restaurant.id_restaurant FROM tbl_users INNER JOIN tbl_restaurant ON tbl_users.id_restaurant = tbl_restaurant.id_restaurant  WHERE id_users = ? && tbl_restaurant.activo = 1", [id_user], (err, result) => {
            if (err){
                res.status(400).json({error})
            }

            if (result.length > 0){
                res.status(200).json({result})
            }else{
                res.status(200).json({result});
            }
        })
    } catch (error) {
        res.status(400).json({error})
    }

}

module.exports = {
    create,
    verifiedRestaurant,
    getRestaurants,
    toggleRestaurant,
    getRestaurant
};
