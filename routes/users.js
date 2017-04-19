var express = require('express')
var router = express.Router()
var passport = require('passport')

var User = require('../models/user')

function authCheck (req, res, next) {
  if (req.isAuthenticated()) {
    req.flash('profileMessage', 'You have already logged in.')
    return res.redirect('/user')
  } else {
    return next()
  }
}
router.route('/signup')
      .get(authCheck, function (req, res) {
        User.find({}, function (err, allUsers) {
          res.render('signup', {
            allUsers: allUsers,
            message: req.flash('signupMessage')
          })
        })
      })
      .post(passport.authenticate('local-signup', {
        successRedirect: '/user',
        failureRedirect: '/signup',
        failureFlash: true
      }))

router.route('/')
      .get(authCheck, function (req, res) {
        res.render('login', {
          message: req.flash('loginMessage'),
          error: req.flash('errorMessage')
        })
      })
      .post(passport.authenticate('local-login', {
        successRedirect: '/user',
        failureRedirect: '/',
        failureFlash: true
      }))

router.get('/user', function (req, res) {
  res.render('user', {
    message: req.flash('profileMessage'),
    user: req.user
  })
})
router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

module.exports = router
