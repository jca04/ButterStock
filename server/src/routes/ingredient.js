const express = require("express");
const checkJwt = require("../middlewares/session");
const {
  getIngredient,
  createIngredient,
  getIngredientsWithRecipe,
  banIngredient,
  unbanIngredient,
  updateIngredients,
} = require("../controllers/ingredients");
const router = express.Router();

router.post("/getIngredients", checkJwt, getIngredient);
router.post("/createIngredient", checkJwt, createIngredient);
router.post("/ingredients", checkJwt, getIngredientsWithRecipe);
router.put("/ban-ingredient", checkJwt, banIngredient);
router.put("/unban-ingredient", checkJwt, unbanIngredient);
router.put("/update-ingredient", checkJwt, updateIngredients);

module.exports = router;
