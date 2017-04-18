var mongoose = require('mongoose')
var Schema = mongoose.Schema

var chefSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  cuisine: {
    type: String,
    required: true
  },
  restaurant: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

var Chef = mongoose.model('Chef', chefSchema)

module.exports = Chef
