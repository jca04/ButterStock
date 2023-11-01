const express = require("express");
const {
    create,
    getRestaurants,
    toggleRestaurant, 
    getRestaurant,
    getRestaurantConfig
} = require("../controllers/restaurant");
const router = express.Router();
const checkJwt = require("../middlewares/session");


router.post("/create", create);
router.get("/getAllRestaurant", checkJwt, getRestaurants);
router.put("/deactivateRestaurant", checkJwt, toggleRestaurant);
router.get("/getRestaurant", checkJwt, getRestaurant);
router.post("/getRestaurantConfig", checkJwt, getRestaurantConfig);
module.exports = router;
