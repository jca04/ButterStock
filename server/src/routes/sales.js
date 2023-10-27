const express = require("express");
const checkJwt = require("../middlewares/session");
const { saveSales } = require('../controllers/sales');
const router = express.Router();

router.post('/saveSales', checkJwt, saveSales);

module.exports = router;

