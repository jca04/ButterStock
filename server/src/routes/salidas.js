const express = require("express");
const router = express.Router();
const checkJwt = require("../middlewares/session");
const { getDataSalidas } = require("../controllers/salidas")

router.post("/getData", checkJwt, getDataSalidas); 

module.exports = router;