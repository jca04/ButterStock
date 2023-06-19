const express = require("express");
const router = express.Router();
const {LocalStorage} = require("node-localstorage");


router.get('/',(req,res) => {

  res.status(200).json({"asd":"das"})
  
});

router.post('/', async(req, res)=>{
  res.status(200).json();
});

module.exports = router;