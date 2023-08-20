const express = require("express");
const checkJwt = require("../middlewares/session");
const {createEditResipe,  getAllResipePerUser}  =  require('../controllers/resipe');
const router = express.Router();


router.post('/create-edit', checkJwt, createEditResipe);
router.post('/resipes', checkJwt,  getAllResipePerUser);


module.exports = router;
