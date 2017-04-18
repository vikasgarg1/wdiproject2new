var mongoose = require('mongoose')

var Schema = mongoose.Schema

var recipeSchema = new Schema({
  recipe_name: {
    type: String,
    required: true
  },
  main_ingredient: {
    type: String,
    required: true
  },
  composition: {
    type: String,
    required: true
  },
  prep_time: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  },
  chef_id: {
    type: Schema.Types.ObjectId,
    ref: 'Chef'
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

var Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe
