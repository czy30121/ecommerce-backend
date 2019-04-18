var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var logger = require('morgan');
var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors')
var expressValidator  = require('express-validator');//req.checkbody()
const mongoConfig = require('./configs/mongo-config')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//mongodb://heroku_8bd94qrf:irstf0rv1ds970eebtislm0apf@ds029638.mlab.com:29638/heroku_8bd94qrf
mongoose.connect(mongoConfig, { useNewUrlParser: true, useCreateIndex: true, },function(error){
  if(error) throw error
    console.log(`connect mongodb success`);
});

var app = express()
app.use(cors())

// Express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'),
    root          = namespace.shift(),
    formParam     = root;

    while(namespace.lenght) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//set static dir
app.use(express.static(path.join(__dirname, 'public')));

//routers
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({err});
  // res.render('error');
});

module.exports = app;
