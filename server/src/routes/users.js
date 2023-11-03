const express = require("express");
const { getUsers, registerUser, loginUser, getUser, getUsersPerRestaurant} = require("../controllers/users");
const checkJwt = require("../middlewares/session");
const router = express.Router();

router.get("/", checkJwt, getUsers);
router.post("/register", registerUser);
router.post("/login",  loginUser);
router.get("/getUser", checkJwt, getUser);
router.post("/getUser", checkJwt, getUsersPerRestaurant);

module.exports = router;

 