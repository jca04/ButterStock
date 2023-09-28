const express = require("express");
const checkJwt = require("../middlewares/session");
const {createEditResipe,  getAllResipePerUser,  getResipeEdit, editQuantity, infoResipe}  =  require('../controllers/resipe');
const router = express.Router();


router.post('/create-edit', checkJwt, createEditResipe);
router.post('/resipes', checkJwt,  getAllResipePerUser);
router.post('/getRespieEdit', checkJwt, getResipeEdit);
router.post('/editQuantity', checkJwt, editQuantity);
router.post('/apiInfoResipe', checkJwt, infoResipe);
module.exports = router;
