var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var flash = require('connect-flash')
var session = require('express-session')
var passport = require('passport')
var methodOverride = require('method-override')
var dotenv = require('dotenv').config({ silent: true })
var MongoStore = require('connect-mongo')(session)
var mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGO_URI)

app.set('view engine', 'ejs')
app.use(session({
  secret: process.env.EXPRESS_SECRET,
  resave: true,
  saveUninitialized: true
}))

require('./config/passport')(passport)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use(express.static(__dirname + '/public'))

app.use(function (req, res, next) {
  res.locals.currentUser = req.user
  next()
})

var usersControllers = require('./controllers/users')
var chefsControllers = require('./controllers/chefs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(methodOverride('_method'))

app.use('/', usersControllers)
app.use('/user/chef', chefsControllers)

app.listen(process.env.PORT || 3000)
console.log('Server initiated at port ' + (process.env.PORT || 3000))
