var express = require('express');
var router = express.Router();

var models = require('../models'),
	Post = models.Post;

// RESTful!

router.post('/', function(req, res) {
	// create a new post
	if(req.body.data)
		Post.generateSecret(function(err, secret) {
			if(err)
				return res.send({
					error : true,
					message : "I'm afraid I can't help you this time. You're dealing with very dangerous people."
				});

			Post.create({
				data : req.body.data,
				'secret' : secret
			}).complete(function(err, post) {
				if(err)
					return res.send({
						error : true,
						message : "I'm afraid I can't help you this time. You're dealing with very dangerous people."
					});

				res.send({
					success : true,
					id : post.id,
					'secret' : post.secret,
					message : "Roger that. The eagle is in the nest. Repeat, the eagle is in the nest."
				});
			});
		});
	else
		res.send({
			error : true,
			message : "Try entering some text first."
		});
});

router.get('/:id', function(req, res) {
	// view post by id
	Post.findOne({
		where : {
			id : req.params.id
		}
	}).complete(function(err, post) {
		if(err)
			return res.send({
				error : true,
				message : "I'm afraid I can't help you this time. You're dealing with very dangerous people."
			});

		if(!post)
			return res.send({
				error : true,
				message : "Can't find it. I must have left it at work."
			});

		post.views += 1;
		post.save().complete(function(err) {
			res.send({
				success : true,
				data : post.data,
				views : post.views
			});
		});
	});
});

router.delete('/:id', function(req, res) {
	// delete the Post using correct secret
	if(req.body.secret)
		Post.destroy({
			where : {
				id : req.params.id,
				secret : req.body.secret
			},
			limit : 1
		}).complete(function(err) {
			if(err)
				return res.send({
					error : true,
					message : "I'm afraid I can't help you this time. You're dealing with very dangerous people."
				});

			Post.findOne({
				where : {
					id : req.params.id
				}
			}).complete(function(err, post) {
				if(err)
					return res.send({
						error : true,
						message : "I'm afraid I can't help you this time. You're dealing with very dangerous people."
					});

				if(!post)
					return res.send({
						success : true,
						message : "You can count on me, boss. When the coppers come askin', I'll tell 'em, \"what post?\""
					});

				if(post)
					return res.send({
						error : true,
						message : "Your secret's bogus! What are you trying to pull here?"
					});
			});
		});
	else
		res.send({
			error : true,
			message : "Did you forget to tell me something?"
		});
});

router.put('/:id', function(req, res) {
	// replace existing text using correct secret
	if(req.body.secret && req.body.data)
		Post.findOne({
			where : {
				id : req.params.id,
				secret : req.body.secret
			}
		}).complete(function(err, post) {
			if(err)
				return res.send({
					error : true
				});

			if(!post)
				return res.send({
					error : true,
					message : "Quit making things up, man!"
				});

			post.data = req.body.data;
			post.save().complete(function(err) {
				if(err)
					return res.send({
						error : true,
						message : "I'm afraid I can't help you this time. You're dealing with very dangerous people."
					});

				res.send({
					success : true,
					message : "Yeah, it sounds better now, but I've still heard this joke before.",
					views : post.views
				});
			});
		});
	else
		res.send({
			error : true,
			message : "I'm only saying this because I care about you, bud. You've got to get that memory problem looked at."
		});
});

module.exports = router;
