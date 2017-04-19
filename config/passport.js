var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

var User = require('../models/user')

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user)
    })
  })

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'user[local][email]',
    passwordField: 'user[local][password]',
    passReqToCallback: true
  }, function (req, email, password, next) {
    process.nextTick(function () {
      User.findOne({'local.email': email}, function (err, foundUser) {
        if (err) {
          return next(err)
        }
        if (foundUser) {
          return next(null, false, req.flash('signupMessage', 'This email has been taken!'))
        } else {
          User.create(req.body.user, function (err, newUser) {
            if (err) throw err
            return next(null, newUser, req.flash('profileMessage', 'You have signed up!'))
          })
        }
      })
    })
  }))

  passport.use('local-login', new LocalStrategy({
    usernameField: 'user[local][email]',
    passwordField: 'user[local][password]',
    passReqToCallback: true
  }, function (req, email, password, done) {
      User.findOne({'local.email': email}, function (err, foundUser) {
        if (err) return done(err)
        if (!foundUser)
          return done(null, false, req.flash('loginMessage', 'No user found! Please sign up!'))
        foundUser.authenticate(password, function (err, authenticated) {
          if (err) return done(err)
          if (authenticated) {
            return done(null, foundUser, req.flash('profileMessage', 'You have logged in, please contribute chefs and recipes!'))
          } else {
            return done(null, false, req.flash('loginMessage', 'Wrong password! Please type your password again!'))
          }
        })
      })
  }))
}
