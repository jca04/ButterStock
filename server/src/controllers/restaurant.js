const conn = require("../db/db");
const { v4: uuidv4 } = require("uuid");
const { encrypt } = require("../utils/bcrypt.handle");
//crear restaurante y el primer usuairo admin que pertenece a ese restaurante
const create = async (req, res) => {
    const uuid = uuidv4();
    const {
        nameRestaurant,
        city,
        address,
        nameUser,
        lastName,
        email,
        pass
    } = req.body;

    try{
        const passHash = await encrypt(pass);
        //crear restaurante
        const createRestaurant = await conn.query('INSERT INTO tbl_restaurant '+
        ' (id_restaurant, nombre, ciudad, direccion, pais, activo) '+
        ' VALUES (?,?,?,?,?,?)',
        [uuid, nameRestaurant, city, address, 'Colombia', 1]);

        if (createRestaurant.affectedRows > 0){
            //crear usuario admin del restaurante
            const createUserAdmin = await conn.query('INSERT INTO tbl_users '+
            ' (id_users, nombre, apellido, correo, contraseña, admin, superAdmin, activo, id_restaurant) '+
            ' VALUES (?,?,?,?,?,?,?,?, ?)',
            [uuidv4(), nameUser, lastName, email, passHash, 1, 0, 1, uuid]);

            if (createUserAdmin.affectedRows > 0){
                res.status(200).json({message: '!Restaurante creado'})
            }
        }else{
            res.status(500).json({message: 'Ha ocurrido un error inesperado'});
        }
    }catch(error){
        res.status(500).json({message: error});
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
                res.status(400).json({err})
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

const getRestaurantConfig = async(req, res) => {
    try {
        const {data} = req.body;
        const id = data.id;

        const getConfigRestaurant = await conn.query('SELECT * FROM tbl_restaurant WHERE id_restaurant = ?', [id]);

        if (getConfigRestaurant.length > 0){
            res.status(200).json({message: getConfigRestaurant});
        }else{
            res.status(500).json({message: 'Ha ocurrido un error, por favor vuelva a intentar'});
        }

    } catch (error) {
        res.status(500).json({message: 'Ha ocurrido un error, por favor vuelva a intentar'});
    }
}

module.exports = {
    create,
    getRestaurants,
    toggleRestaurant,
    getRestaurant,
    getRestaurantConfig
};
