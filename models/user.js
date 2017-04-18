var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var Schema = mongoose.Schema

var userSchema = new Schema({
  local: {
    username: {
      type: String,
      required: [true, 'Type your username']
    },
    email: {
      type: String,
      required: [true, 'Type your email adress']
    },
    password: {
      type: String,
      required: [true, 'Type your password'],
      minlength: [5, 'Password too short']
    }
  }
})

userSchema.pre('save', function (next) {
  var user = this
  bcrypt.genSalt(function (err, salt) {
    if (err) return next(err)

    bcrypt.hash(user.local.password, salt, function (err, hash) {
      if (err) return next(err)

      user.local.password = hash
      next()
    })
  })
})

userSchema.methods.authenticate = function (givenPassword, callback) {
  var hashedPassword = this.local.password

  bcrypt.compare(givenPassword, hashedPassword, function (err, isMatch) {
    callback(err, isMatch)
  })
}

var User = mongoose.model('User', userSchema)

module.exports = User
