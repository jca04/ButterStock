const express = require("express");
const checkJwt = require("../middlewares/session");
const {createEditResipe,  getAllResipePerUser,  getResipeEdit}  =  require('../controllers/resipe');
const router = express.Router();


router.post('/create-edit', checkJwt, createEditResipe);
router.post('/resipes', checkJwt,  getAllResipePerUser);
router.post('/getRespieEdit', checkJwt, getResipeEdit);
module.exports = router;
