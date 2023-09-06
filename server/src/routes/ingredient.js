const express = require("express");
const checkJwt = require("../middlewares/session");
const {
  getIngredient,
  createIngredient,
  getIngredientsWithRecipe,
  banIngredient,
  unbanIngredient,
} = require("../controllers/ingredients");
const router = express.Router();

router.post("/getIngredients", checkJwt, getIngredient);
router.get("/createIngredient", checkJwt, createIngredient);
router.post("/ingredients", checkJwt, getIngredientsWithRecipe);
router.put("/ban-ingredient", checkJwt, banIngredient);
router.put("/unban-ingredient", checkJwt, unbanIngredient);

module.exports = router;
