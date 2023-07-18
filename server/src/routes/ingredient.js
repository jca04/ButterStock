const express = require("express");
const checkJwt = require("../middlewares/session");
const {getIngredient}  =  require('../controllers/ingredients');
const router = express.Router();


router.post('/getIngredients', checkJwt, getIngredient);

module.exports = router;
