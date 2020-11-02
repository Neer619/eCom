var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const validator = require('express-validator');
const mongoStore = require('connect-mongo')(session);


var indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const { MongoStore } = require('connect-mongo');


var app = express();


//Connect to DB
const dbURI = "mongodb+srv://user:user123@cluster0.nxt3y.mongodb.net/eCom?retryWrites=true&w=majority"
mongoose.connect(dbURI,{useNewUrlParser:true,useUnifiedTopology:true})
.then((result)=>{
  console.log('Connected to DB');
}).catch((err)=>{
  console.log(err);
})

require('./config/passport')




// view engine setup
app.set('layout','layouts/layout' );
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator())
app.use(cookieParser());
app.use(session({
  secret:'thisismysecretCode',
  resave:false,
  saveUninitialized:false,
  store:new mongoStore({mongooseConnection:mongoose.connection}),
  cookie:{maxAge:60*60*1000}

}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


app.use((req,res,next)=>{
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
})

app.use('/user',userRouter);
app.use('/', indexRouter);



/* app.use('/*',(req,res)=>{
  res.render('404',{title:'Page not found!'})
}) */

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
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
