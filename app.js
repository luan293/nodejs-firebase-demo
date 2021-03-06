var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
firebase = require('firebase');
var config = {
    apiKey: "AIzaSyD-NuiVXjoB4p_DETbIDLkarI-58xE1Tys",
    authDomain: "nodejs-test-f72db.firebaseapp.com",
    databaseURL: "https://nodejs-test-f72db.firebaseio.com",
    projectId: "nodejs-test-f72db",
    storageBucket: "nodejs-test-f72db.appspot.com",
    messagingSenderId: "60472350954"
  };
firebase.initializeApp(config);
var expressSession = require('express-session');
//var index = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
	secret: 'luandeptrai',
	resave: false,
	saveUninitialized: true
}))
//app.use('/', index);
//app.use('/users', users);

var userRouter = require('./routes/users');
userRouter(app);  
//app.use('/users', userRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
