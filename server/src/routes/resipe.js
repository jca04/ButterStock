const express = require("express");
const checkJwt = require("../middlewares/session");
const {createEditResipe,  getAllResipePerUser, getResipeLimit}  =  require('../controllers/resipe');
const router = express.Router();


router.post('/create-edit', checkJwt, createEditResipe);
router.post('/resipes', checkJwt,  getAllResipePerUser);
router.post('/getResipeLimit', checkJwt, getResipeLimit);
module.exports = router;
