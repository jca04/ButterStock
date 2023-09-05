const express = require("express");
const checkJwt = require("../middlewares/session");
const {
  getIngredient,
  createIngredient,
  getIngredientsWithRecipe,
} = require("../controllers/ingredients");
const router = express.Router();

router.post("/getIngredients", checkJwt, getIngredient);
router.get("/createIngredient", checkJwt, createIngredient);
router.get("/", checkJwt, getIngredientsWithRecipe);

module.exports = router;
