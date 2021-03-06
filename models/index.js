"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
var dbConfig    = require(__dirname + '/../config/db.js');
var sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, {
	dialect : 'mariadb',
	dialectOptions : {
		unixSocket : dbConfig.unixSocket,
		compress : false,
		ssl : false
	},
	port : dbConfig.port
});
var db        = {};

fs.readdirSync(__dirname).
	filter(function(file) {
		return (file.indexOf(".") !== 0) && (file !== "index.js");
	}).
	forEach(function(file) {
		var model = sequelize["import"](path.join(__dirname, file));
		db[model.name] = model;
	});

Object.keys(db).forEach(function(modelName) {
	if ("associate" in db[modelName]) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

