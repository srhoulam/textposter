"use strict";

var crypto = require('crypto'),
	Base64 = require('urlsafe-base64');

module.exports = function(sequelize, DataTypes) {
	var Post = sequelize.define("Post",
		{
			data : {
				type : DataTypes.TEXT,
				allowNull : false
			},
			secret : DataTypes.STRING,
			views : {
				type : DataTypes.INTEGER,
				allowNull : false,
				defaultValue : 0
			}
		}, {
			classMethods : {
				generateSecret : function(callback) {
					crypto.randomBytes(8, function(err, buffer) {
						if(err)
							return callback(err);

						callback(null, Base64.encode(buffer));
					}); // end crypto.randomBytes call
				}
			} // end classMethods object
		}
	); // end sequelize.define call

	return Post;
};
