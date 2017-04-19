var express = require('express')
var router = express.Router()

var Recipe = require('../models/recipe')
var Chef = require('../models/chef')

router.get('/', function (req, res) {
  Chef.findById({_id: req.params.id}, function (err, chef) {
    Recipe.find({
      chef_id: chef._id
    })
    .populate('chef_id')
    .populate('user_id')
    .exec(function (err, allRecipes) {
      res.render('recipe', {
        chef: chef,
        allRecipes: allRecipes
      })
    })
  })
})
router.get('/:id', function (req, res) {
  Chef.findById({_id: req.params.id}, function (err, chef) {
    Recipe.find({
      chef_id: chef._id
    })
    .populate('chef_id')
    .exec(function (err, allRecipes) {
      res.render('recipe', {
        chef: chef,
        allRecipes: allRecipes
      })
    })
  })
})
router.get('/:id/new', function (req, res) {
  // Chef.findById({_id: req.params.id}, function (err, chef) {
  //   Recipe.find({
  //     chef_id: chef._id
  //   })
  //   .populate('chef_id')
  //   .exec(function (err, allRecipes) {
  //     res.render('newrecipe', {
  //       chef: chef,
  //       allRecipes: allRecipes
  //     })
  //   })
  // })
  Chef.findById({_id: req.params.id}, function (err, chef) {
    res.render('newrecipe', {
      chef: chef
    })
  })
})
router.post('/:id/new', function (req, res) {
  Chef.findById({_id: req.params.id}, function (err, chef) {
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
      if (err) throw err
      res.redirect('/user/recipe/' + req.params.id)
    })
  })
})
// router.get('/:id/edit', function (req, res) {
//   Chef.findById({_id: req.params.id}, function (err, chef) {
//     Recipe.findById(req.params.id)
//     .populate('chef_id')
//     .exec(function (err, recipe) {
//       res.render('editrecipe', {
//         chef: chef,
//         recipe: recipe
//       })
//     })
//   })
//   Chef.findById({_id: req.params.id}, function (err, chef) {
//     Recipe.find({
//       chef_id: chef._id
//     })
//     .populate('chef_id')
//     .exec(function (err, allRecipes) {
//       res.render('editrecipe', {
//         chef: chef,
//         recipe: recipe
//       })
//     })
//   })
// })
// router.post('/:id/edit', function (req, res) {
//
// })
router.delete('/:id', function (req, res) {
  console.log(req.user.chef)
  Recipe.find({}, function (err, chef) {
    Recipe.findByIdAndRemove(req.params.id, function (err, recipe) {
      if (err) {
        throw err
      } else {
        res.redirect('/user/recipe/<%=chef._id%>', {
          chef: chef
        })
      }
    })
  })
})

module.exports = router
