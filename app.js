var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');

var routes = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// accept cross-origin JSON requests from localhost
// change this in "production" my front-end page
app.use(cors({
	origin : 'http://saad.rhoulam.com',
	methods : ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']
}));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.send({
			error : {
				message : err.message,
				status : err.status
			},
			raw : err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.sendStatus(err.status || 500);
});


module.exports = app;
