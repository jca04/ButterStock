const express = require("express");
const { create, verifiedRestaurant, getRestaurant } = require("../controllers/restaurant");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const checkJwt = require("../middlewares/session");

//configurar multer para este restaurant
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../../client/src/public/uploads"),
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname).toLocaleLowerCase());
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log(file)
    const fileTypes = /jpeg|png|jpg|gif|svg/
    const mimetype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimetype && extname){
      return cb(null, true);
    } 

    cb("Error: archivo debe ser una imagen valida");
  },
}).single("image");


router.post("/create", upload, create);
router.post("/verifiedRestaurant", verifiedRestaurant);
router.get("/getRestaurant", checkJwt , getRestaurant);


module.exports = router;
