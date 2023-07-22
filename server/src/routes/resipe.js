const express = require("express");
const checkJwt = require("../middlewares/session");
const {createResipe,  getAllResipePerUser}  =  require('../controllers/resipe');
const router = express.Router();


router.post('/create', checkJwt, createResipe);
router.post('/resipes', checkJwt,  getAllResipePerUser);

module.exports = router;
