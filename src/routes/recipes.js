const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController');

router.get('/', recipesController.getPopularRecipes);
// router.get('/')

module.exports = router;