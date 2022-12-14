var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methoOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const cors = require('cors');
// Import mongoose
const mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost:27017/db_staycation');
mongoose.connect(
	'mongodb+srv://glempo:glempo123@cluster0.kx2m3p0.mongodb.net/db_staycation?retryWrites=true&w=majority'
);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var apiRouter = require('./routes/api');

var app = express();

app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(methoOverride('_method'))
app.use(
	session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: 60000 },
	})
);
app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
	'/sb-admin-2',
	express.static(
		path.join(__dirname, 'node_modules/startbootstrap-sb-admin-2')
	)
);
app.use(
	'/assets',
	express.static(
		path.join(__dirname, 'assets')
	)
);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/api/v1/member', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
