var express = require('express')
var router = express.Router()

var User = require('../models/user')
var Chef = require('../models/chef')
var Recipe = require('../models/recipe')

// Go to chefs page
router.get('/', function (req, res) {
 Chef.find({}).populate('user').exec( function (err, allChefs) {
    res.render('chef', {
      allChefs: allChefs
    })
  })
})
// Create new chef
router.get('/new', function (req, res) {
  res.render('newchef')
})
// Save new chef
router.post('/new', function (req, res) {
  User.find(req.user._id, function (err, user) {
    var newChef = new Chef({
      name: req.body.chef.name,
      cuisine: req.body.chef.cuisine,
      restaurant: req.body.chef.restaurant,
      user: req.user._id
    })
    newChef.save(function (err, savedChef) {
      if (err) {
        return res.redirect('/user/chef/new')
      } else {
        res.redirect('/user/chef')
      }
    })
  })
})
// Edit chef
router.get('/:id/edit', function (req, res) {
  Chef.findById(req.params.id, function (err, chef) {
    res.render('editchef', {
      chef: chef
    })
  })
})
// Update chef
router.put('/:id/edit', function (req, res) {
  var editChef = req.body.chef
  Chef.findByIdAndUpdate(req.params.id, editChef, function (err, chef) {
    if (err) {
      return res.redirect('/user/chef/' + req.params.id + '/edit')
    } else {
      res.redirect('/user/chef')
    }
  })
})
// Remove chef
router.delete('/:id', function (req, res) {
  Chef.findByIdAndRemove(req.params.id, function (err, chef) {
    if (err) {
      throw err
    } else {
      res.redirect('/user/chef')
    }
  })
})

// Go to recipes page
router.get('/:id/recipe', function (req, res) {
  Chef.findOne({_id: req.params.id}, function (err, chef) {
    Recipe.find({
      chef_id: chef._id
    })
    .populate('user_id')
    .exec(function (err, allRecipes) {
      if (err) {
        return res.redirect('/user')
      } else {
        res.render('recipe', {
          chef: chef,
          allRecipes: allRecipes
        })
      }
    })
  })
})
// Create new recipe
router.get('/:id/recipe/new', function (req, res) {
  Chef.findById(req.params.id, function (err, chef) {
    res.render('newrecipe', {
      chef: chef
    })
  })
})
// Save new recipe
router.post('/:id/recipe/new', function (req, res) {
  Chef.findById(req.params.id, function (err, chef) {
    var newRecipe = new Recipe({
      recipe_name: req.body.recipe.recipe_name,
      main_ingredient: req.body.recipe.main_ingredient,
      composition: req.body.recipe.composition,
      prep_time: req.body.recipe.prep_time,
      difficulty: req.body.recipe.difficulty,
      chef_id: req.params.id,
      user_id: req.user._id
    })
    newRecipe.save(function (err, savedRecipe) {
      if (err) {
        return res.redirect('/user/chef/' + req.params.id + '/recipe/new')
      } else {
        res.redirect('/user/chef/' + req.params.id + '/recipe')
      }
    })
  })
})
// Edit recipe
router.get('/:prop_id/recipe/:id/edit', function (req, res) {
  Chef.findById(req.params.prop_id, function (err, chef) {
    Recipe.findById(req.params.id, function (err, recipe) {
      res.render('editrecipe', {
        chef: chef,
        recipe: recipe
      })
    })
  })
})
// Update recipe
router.put('/:prop_id/recipe/:id/edit', function (req, res) {
  var editRecipe = req.body.recipe
  Recipe.findByIdAndUpdate(req.params.id, editRecipe, function (err, recipe) {
    if (err) {
      return res.redirect('/user/chef/' + req.params.prop_id + '/recipe/' + req.params.id + '/new')
    } else {
      res.redirect('/user/chef/' + req.params.prop_id + '/recipe')
    }
  })
})
// Delete recipe
router.delete('/:prop_id/recipe/:id', function (req, res) {
  Recipe.findByIdAndRemove(req.params.id, function (err, recipe) {
    if (err) {
      throw err
    } else {
      res.redirect('/user/chef/' + req.params.prop_id + '/recipe')
    }
  })
})

module.exports = router
